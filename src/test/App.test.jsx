import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

function getTreePane(container) {
  return container.querySelector('[tabindex="0"]')
}

async function openLegalCasePath(user) {
  await user.click(screen.getByText('01_Legal_Department'))
  await user.click(screen.getByText('Active_Cases'))
}

describe('SecureVault explorer interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('expands and collapses folders with nested descendants', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByText('Active_Cases')).not.toBeInTheDocument()
    await user.click(screen.getByText('01_Legal_Department'))
    expect(screen.getByText('Active_Cases')).toBeInTheDocument()
    await user.click(screen.getByText('01_Legal_Department'))
    expect(screen.queryByText('Active_Cases')).not.toBeInTheDocument()
  })

  it('renders nested folders when each parent is expanded', async () => {
    const user = userEvent.setup()
    render(<App />)

    await openLegalCasePath(user)
    expect(screen.getByText('Doe_vs_MegaCorp_Inc')).toBeInTheDocument()
    await user.click(screen.getByText('Doe_vs_MegaCorp_Inc'))
    expect(screen.getByText('Discovery_Phase')).toBeInTheDocument()
  })

  it('selects a file and updates the inspector details', async () => {
    const user = userEvent.setup()
    render(<App />)

    await openLegalCasePath(user)
    await user.click(screen.getByText('Doe_vs_MegaCorp_Inc'))
    await user.click(screen.getByText('Case_Summary_Draft_v3.docx'))

    expect(screen.getAllByText('Case_Summary_Draft_v3.docx').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Word Document')).toHaveLength(2)
    expect(screen.getAllByText('45KB')).toHaveLength(2)
    expect(screen.getByText('File Details')).toBeInTheDocument()
  })

  it('moves through visible items and enters or leaves folders with arrow keys', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const treePane = getTreePane(container)

    treePane.focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Active_Cases')).toBeInTheDocument()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Doe_vs_MegaCorp_Inc')).toBeInTheDocument()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Discovery_Phase')).toBeInTheDocument()
    await user.keyboard('{ArrowLeft}')
    expect(screen.queryByText('Discovery_Phase')).not.toBeInTheDocument()
    await user.keyboard('{ArrowLeft}')
    await user.keyboard('{ArrowRight}')
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Discovery_Phase')).toBeInTheDocument()
  })

  it('filters recursively, keeps matching parents, and clears the search', async () => {
    const user = userEvent.setup()
    render(<App />)
    const search = screen.getByPlaceholderText('Search files and folders...')

    await user.type(search, 'summary_draft')
    expect(screen.getByText('01_Legal_Department')).toBeInTheDocument()
    expect(screen.getByText('Summary_Draft')).toBeInTheDocument()
    expect(screen.queryByText('Property_Valuation_Report.xlsx')).not.toBeInTheDocument()

    await user.clear(search)
    expect(screen.getByText('02_Finance_Team')).toBeInTheDocument()
  })

  it('shows a no-results state for unmatched search input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByPlaceholderText('Search files and folders...'), 'does-not-exist')

    expect(screen.getByText('No results for "does-not-exist"')).toBeInTheDocument()
  })

  it('copies the selected file breadcrumb path', async () => {
    const user = userEvent.setup()
    const clipboardWrite = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    render(<App />)

    await openLegalCasePath(user)
    await user.click(screen.getByText('Doe_vs_MegaCorp_Inc'))
    await user.click(screen.getByText('Case_Summary_Draft_v3.docx'))
    await user.click(screen.getByTitle('Copy full path'))

    expect(clipboardWrite).toHaveBeenCalledWith(
      'SecureVault / 01_Legal_Department / Active_Cases / Doe_vs_MegaCorp_Inc / Case_Summary_Draft_v3.docx'
    )
    expect(screen.getByTitle('Path copied')).toBeInTheDocument()
  })
})