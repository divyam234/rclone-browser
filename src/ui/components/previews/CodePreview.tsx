import { FC, memo } from "react"
import Editor from "@monaco-editor/react"
import { Box } from "@mui/material"

import useFileContent from "@/ui/hooks/useFileContent"
import { getLanguageByFileName } from "@/ui/utils/previewType"

const CodePreview: FC<{ name: string; mediaUrl: string }> = ({
  name,
  mediaUrl,
}) => {
  const { response: content, error, validating } = useFileContent(mediaUrl)

  return (
    <>
      {validating ? null : (
        <Editor
          options={{
            readOnly: true,
          }}
          language={getLanguageByFileName(name)}
          theme="vs-dark"
          height="100%"
          value={content}
        />
      )}
    </>
  )
}

export default memo(CodePreview)
