import * as React from "react"

interface UseClipboardOptions {
  timeout?: number
}

interface UseClipboardReturn {
  copy: (text: string) => Promise<void>
  paste: () => Promise<string>
  error: Error | null
}

export function useClipboard(options: UseClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options
  const [error, setError] = React.useState<Error | null>(null)

  const copy = React.useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand("copy")
        } finally {
          textArea.remove()
        }
      }
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to copy"))
    }
  }, [])

  const paste = React.useCallback(async (): Promise<string> => {
    try {
      const text = await navigator.clipboard.readText()
      setError(null)
      return text
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to paste"))
      return ""
    }
  }, [])

  return { copy, paste, error }
}
