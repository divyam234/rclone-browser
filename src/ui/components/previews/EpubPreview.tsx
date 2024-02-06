import { FC, memo, useState } from "react"
import { Rendition } from "epubjs"
import { ReactReader } from "react-reader"

const EpubPreview: FC<{ mediaUrl: string }> = ({ mediaUrl }) => {
  const [location, setLocation] = useState<string>()

  const onLocationChange = (cfiStr: string) => setLocation(cfiStr)

  const fixEpub = (rendition: Rendition) => {
    const spineGet = rendition.book.spine.get.bind(rendition.book.spine)
    rendition.book.spine.get = function (target: string) {
      const targetStr = target as string
      let t = spineGet(target)
      while (t == null && targetStr.startsWith("../")) {
        target = targetStr.substring(3)
        t = spineGet(target)
      }
      return t
    }
  }

  return (
    <ReactReader
      url={mediaUrl}
      getRendition={(rendition) => fixEpub(rendition)}
      location={location!}
      locationChanged={onLocationChange}
      epubInitOptions={{ openAs: "epub" }}
      epubOptions={{ flow: "scrolled", allowPopups: true }}
    />
  )
}

export default memo(EpubPreview)
