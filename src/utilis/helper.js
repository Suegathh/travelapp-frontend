const NO_SEARCH_DATA_IMG = "./assets/images/bg-image.webp";
const NO_FILTER_DATA_IMG = 'path/to/no_filter_data_image.png';
const ADD_STORY_IMG = 'path/to/add_story_image.png';

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const getEmptyCardMessage = (filterType) => {
  switch (filterType) {
    case "search":
      return "Oops, no story found";

    case "date":
      return "No story found in the given date range";

    default:
      return "Start your first travel story! Click the 'add' button to jot down your thoughts, ideas, and memories. Let's get started!";
  }
};

export const getEmptyCardImg = (filterType) => {
  switch (filterType) {
    case "search":
      return NO_SEARCH_DATA_IMG;
    case "date":
      return NO_FILTER_DATA_IMG;
    default:
      return ADD_STORY_IMG;
  }
};
