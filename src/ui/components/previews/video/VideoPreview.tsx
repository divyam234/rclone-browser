import { FC, memo, useEffect, useRef } from "react"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import type Artplayer from "artplayer"
import type ArtOption from "artplayer/types/option"
import { AspectRatio } from "artplayer/types/player"

import Player from "./ArtPlayer"

const aspectRatioes = ["default", "4:3", "16:9"]

const VideoPlayer: FC<{
  videoName: string
  videoUrl: string
}> = ({ videoName, videoUrl }) => {
  const theme = useTheme()

  const artInstance = useRef<Artplayer | null>(null)

  const artOptions: ArtOption = {
    container: "",
    url: videoUrl,
    volume: 0.6,
    muted: false,
    autoplay: true,
    pip: true,
    autoSize: false,
    autoMini: true,
    screenshot: true,
    setting: true,
    flip: true,
    playbackRate: true,
    aspectRatio: true,
    fullscreen: true,
    fullscreenWeb: true,
    mutex: true,
    backdrop: true,
    hotkey: true,
    playsInline: true,
    autoPlayback: true,
    airplay: true,
    theme: theme.palette.primary.main,
    lock: true,
    fastForward: true,
    autoOrientation: true,
    moreVideoAttr: {
      playsInline: true,
    },
  }

  useEffect(() => {
    if (artInstance.current && videoUrl) {
      artInstance.current.switchUrl(videoUrl)
      artInstance.current.title = videoName
    }
    return () => {
      if (artInstance.current) {
        artInstance.current.video.pause()
        artInstance.current.video.removeAttribute("src")
        artInstance.current.video.load()
      }
    }
  }, [videoName, videoUrl])

  return (
    <Player
      option={artOptions}
      style={{ aspectRatio: "16 /9" }}
      getInstance={(art) => {
        artInstance.current = art
        art.hotkey.add(65, () => {
          art.aspectRatio = aspectRatioes[
            (aspectRatioes.findIndex((val) => val === art.aspectRatio) + 1) %
              aspectRatioes.length
          ] as AspectRatio
        })
      }}
    />
  )
}

const VideoPreview: FC<{ name: string; mediaUrl: string }> = ({
  name,
  mediaUrl,
}) => {
  return (
    <Box
      sx={{
        width: { xs: "100%", md: "70%" },
        margin: "auto",
        padding: "1rem",
      }}
    >
      <VideoPlayer videoName={name} videoUrl={mediaUrl} />
    </Box>
  )
}
export default memo(VideoPreview)
