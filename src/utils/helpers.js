// Vaqtni formatlash
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Qisqa vaqt formati
export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Guruh kodini formatlash (8 ta belgi)
export const formatGroupCode = (code) => {
  return code?.toUpperCase().replace(/[^A-Z0-9]/g, '');
};

// Position o'zgarishini ko'rsatish
export const getPositionChange = (change) => {
  if (change > 0) return { text: `+${change}`, color: 'green', icon: '↑' };
  if (change < 0) return { text: `${change}`, color: 'red', icon: '↓' };
  return { text: '0', color: 'gray', icon: '→' };
};

// Loading holatini boshqarish
export const withLoading = async (asyncFunction, setLoading) => {
  try {
    setLoading(true);
    return await asyncFunction();
  } finally {
    setLoading(false);
  }
};

// Xatoliklarni formatlash
export const formatError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return 'Noma\'lum xatolik yuz berdi';
};

// Toast xabarlar uchun
export const showToast = (message, type = 'info') => {
  // Bu yerda toast library ishlatish mumkin
  console.log(`${type.toUpperCase()}: ${message}`);
};

// Form validatsiya
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateGroupName = (name) => {
  return name && name.trim().length >= 3;
};

export const validateStudentName = (name) => {
  return name && name.trim().length >= 2;
};

// Local storage yordamchilari
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage xatoligi:', error);
    }
  },
  
  remove: (key) => {
    localStorage.removeItem(key);
  }
};

// Rang generatori (o'quvchilar uchun)
export const generateColor = (index) => {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
    '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
  ];
  return colors[index % colors.length];
};

// CSV ga export qilish
export const exportToCSV = (data, filename) => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + data.map(row => Object.values(row).join(",")).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};