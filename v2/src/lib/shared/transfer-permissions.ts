interface TransferState {
  createdBy: { id: string };
  forwards: { completed: boolean; receiver: { id: string } }[];
}

/**
 * Audits and evaluations are handed from person to person: the creator can forward until a transfer is pending;
 * after that only the receiver of the latest, completed transfer can forward again.
 */
export const canForward = (record: TransferState, userId?: string) =>
  record.forwards.length > 0
    ? record.forwards[0].completed && record.forwards[0].receiver.id === userId
    : record.createdBy.id === userId;

/** The receiver of a pending (not yet completed) transfer is the one who fills in the scores. */
export const canComplete = (record: TransferState, userId?: string) =>
  record.forwards.length > 0 && !record.forwards[0].completed && record.forwards[0].receiver.id === userId;
