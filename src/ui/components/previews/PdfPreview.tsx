import { FC, memo } from "react"
import { Box } from "@mui/material"

const PDFEmbedPreview: FC<{ mediaUrl: string }> = ({ mediaUrl }) => {
  const url = `https://alist-org.github.io/pdf.js/web/viewer.html?file=${mediaUrl}`
  return (
    <Box
      component={"iframe"}
      title="PdfView"
      sx={{
        position: "relative",
        border: "none",
        zIndex: 101,
      }}
      src={url}
      width="100%"
      height="100%"
      allowFullScreen
    />
  )
}

export default memo(PDFEmbedPreview)
