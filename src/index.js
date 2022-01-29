import { useEffect, useState } from "react";

const useClipboard = (
  { updateFrequency = 1000 } = {},
  onReadError = () => {}
) => {
  const [clipboard, setClipboardContent] = useState("");

  const copyToClipboard = (
    clipboardContent,
    onCopyToClipboard = () => {},
    onWriteError = () => {}
  ) => {
    if (navigator.permissions && navigator.clipboard) {
      navigator.permissions
        .query({ name: "clipboard-write" })
        .then(({ state }) => {
          if (["granted", "prompt"].includes(state)) {
            navigator.clipboard.writeText(clipboardContent).then(() => {
              setClipboardContent(clipboardContent);
              onCopyToClipboard(clipboardContent);
            }, onWriteError);
          } else {
            onWriteError({
              message:
                "ClipboardWrite permission has been blocked as the user.",
            });
          }
        });
    }
  };

  useEffect(() => {
    let readClipboardIntervalId;
    if (navigator.permissions && navigator.clipboard) {
      navigator.permissions
        .query({ name: "clipboard-read" })
        .then(({ state }) => {
          if (["granted", "prompt"].includes(state)) {
            readClipboardIntervalId = setInterval(() => {
              navigator.clipboard.readText().then((clipboardContent) => {
                setClipboardContent(clipboardContent);
              }, onReadError);
            }, updateFrequency);
          } else {
            onReadError({
              message: "ClipboardRead permission has been blocked as the user.",
            });
          }
        });
    }
    return () => {
      if (navigator.clipboard) {
        clearInterval(readClipboardIntervalId);
      }
    };
  }, []);

  return [clipboard, copyToClipboard];
};

export default useClipboard;
