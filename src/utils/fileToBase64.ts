export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Invalid file result"));
        return;
      }

      const base64 = result.split(",")[1];
      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Could not read file"));
    };

    reader.readAsDataURL(file);
  });
}