export const fetchUser = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve({
          _id: "639dg29h92jf929ehf32",
          name: "John Doe",
          email: "john@doe.com",
        });
      } else {
        reject(new Error("Failed to fetch user data"));
      }
    }, 2000);
  });
};
