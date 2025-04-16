export const MergeStrategy = {
  KEEP_NEWEST: 'keep_newest',
  KEEP_OLDEST: 'keep_oldest',
  KEEP_MOST_COMPLETE: 'keep_most_complete',
  MANUAL: 'manual'
};

export const resolveMergeConflicts = (contact1, contact2, strategy = MergeStrategy.KEEP_MOST_COMPLETE) => {
  switch (strategy) {
    case MergeStrategy.KEEP_NEWEST:
      return contact1.created_at > contact2.created_at ? contact1 : contact2;
    
    case MergeStrategy.KEEP_MOST_COMPLETE:
      return Object.keys(contact1).reduce((merged, key) => {
        merged[key] = contact1[key] || contact2[key];
        return merged;
      }, {});

    case MergeStrategy.MANUAL:
      return { conflicts: findConflicts(contact1, contact2) };

    default:
      return contact1;
  }
};