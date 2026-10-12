import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ConfirmDeleteDialog } from '../src/components/ConfirmDeleteDialog';

describe('ConfirmDeleteDialog Component', () => {
  it('renders confirmation message and handles confirm and close actions', () => {
    const handleConfirm = vi.fn().mockResolvedValue(undefined);
    const handleClose = vi.fn();

    render(
      <ConfirmDeleteDialog
        open={true}
        title="Delete Record"
        message="Are you sure you want to delete this employee?"
        onConfirm={handleConfirm}
        onClose={handleClose}
        isDeleting={false}
      />
    );

    expect(screen.getByText('Delete Record')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to delete this employee?')
    ).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);

    const cancelBtn = screen.getByRole('button', { name: /^cancel$/i });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
