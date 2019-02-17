# react-hook-clipboard :clipboard:

A React hook to access the clipboard.

## Installation

Using `npm`:

```sh
npm install --save react-hook-clipboard
```

Using `yarn`:

```sh
yarn add react-hook-clipboard
```

## Basic usage

The `useClipboard()` hook, similarly to the `useState()` hook, returns an array of two elements: 
- the first element contains the clipboard content which is getting updated at regular intervals
- the second element is function which can be called with a value that will be copied to the clipboard

```jsx
import React from 'react'
import useClipboard from 'react-hook-clipboard'

const ComponentWithClipboard = () => {
  const [clipboard, copyToClipboard] = useClipboard()
  const toClipboard = 'I want to go to the clipboard'

  return (
    <div className="App">
      <p>Clipboard content: {clipboard}</p>
      <button onClick={() => copyToClipboard(toClipboard)}>
        Copy to clipboard
      </button>
    </div>
  )
}
```

## Tweaking update frequency

The default update frequency of the clipboard content is 1 second which can be overridden by calling `useClipboard` with an argument which is an options object, and has a member called `updateFrequency` that indicates the desired update frequency in milliseconds:

```jsx
const [clipboard, copyToClipboard] = useClipboard({updateFrequency: 500}) 
```

Read more about this in [Caveats](#caveats).

## Using callbacks

### Reading from the clipboard

To be able to react to reading errors from the clipboard (for example due to the user blocking clipboard permission), you can call `useClipboard` with a second argument which is a function that will be called when these errors occur:

```jsx
import React from 'react'
import useClipboard from 'react-hook-clipboard'

const ComponentWithClipboard = () => {
  const handleClipboardReadError = error => {
    console.log(
      'There was an error reading from the clipboard:',
      error
    )
  }

  const [clipboard, copyToClipboard] = useClipboard(
    {},
    handleClipboardReadError
  )

  const toClipboard = 'I want to go to the clipboard'

  return (
    <div className="App">
      <p>Clipboard content: {clipboard}</p>
      <button onClick={() => copyToClipboard(toClipboard)}>
        Copy to clipboard
      </button>
    </div>
  )
}
```

### Writing to the clipboard

You may want to react to both successful and failed attempts to copy content to the clipboard.

To achieve this, you can call `copyToClipboard` with a second and a third argument which are both functions, you can use the former to react to a successful copying and the latter to handle errors:

```jsx
import React from 'react'
import useClipboard from 'react-hook-clipboard'

const ComponentWithClipboard = () => {
  const [clipboard, copyToClipboard] = useClipboard({})

  const toClipboard = 'I want to go to the clipboard'

  const handleClipboardWriteSuccess = clipboardContent => {
    console.log(
      `'${clipboardContent}' was successfully copied to the clipboard.`
    )
  }

  const handleClipboardWriteError = error => {
    console.log(
      'There was an error writing to the clipboard:',
      error
    )
  }

  return (
    <div className="App">
      <p>Clipboard content: {clipboard}</p>
      <button
        onClick={() => copyToClipboard(
          toClipboard,
          handleClipboardWriteSuccess,
          handleClipboardWriteError
        )}
      >
        Copy to clipboard
      </button>
    </div>
  )
}
```

## Notes

Access to the Clipboard API requires user permission.
If permission to access the clipboard was previously granted by the user, clipboard data will be available. If permission was not granted previously, the user will be prompted to give permission when the component mounts. In permission was previously denied by the user, if the user agent does not support the Clipboard API or the Permissions API, you will not be able to gain clipboard access.

## Caveats

Listening to clipboard content changes lacks decent browser support. Therefore this hook is accessing clipboard content at regular intervals, which can result in a delay in registering changes in clipboard content and lead to performance issues if the update frequency is low. 

The Clipboard API is available only in secure contexts (a.k.a. only using HTTPS).

Due to security reasons the Clipboard API is only accessible while the browser tab is in focus. For as long as the browser tab is out of focus, the clipboard content provided by `useClipboard` might be outdated or blank, and attempts to write to the clipboard will fail.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## Licence

LGPL-3.0
