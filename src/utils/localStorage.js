const SAVED_GROUPS_KEY = 'grouptable_saved_groups';

export const getSavedGroups = () => {
  try {
    const saved = localStorage.getItem(SAVED_GROUPS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveGroup = (code, name) => {
  const savedGroups = getSavedGroups();
  const existingIndex = savedGroups.findIndex(group => group.code === code);
  
  const newGroup = {
    code,
    name,
    savedAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    savedGroups[existingIndex] = newGroup;
  } else {
    savedGroups.unshift(newGroup);
  }

  // Keep max 10 saved groups
  const limitedGroups = savedGroups.slice(0, 10);
  localStorage.setItem(SAVED_GROUPS_KEY, JSON.stringify(limitedGroups));
};

export const removeSavedGroup = (code) => {
  const savedGroups = getSavedGroups();
  const filteredGroups = savedGroups.filter(group => group.code !== code);
  localStorage.setItem(SAVED_GROUPS_KEY, JSON.stringify(filteredGroups));
};

export const isGroupSaved = (code) => {
  const savedGroups = getSavedGroups();
  return savedGroups.some(group => group.code === code);
};