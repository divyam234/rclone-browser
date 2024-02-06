import { useCallback, useMemo } from "react"
import { ModalState, SetValue } from "@/types"
import {
  ChonkyActions,
  ChonkyActionUnion,
  ChonkyIconName,
  CustomVisibilityState,
  defineFileAction,
  MapFileActionsToData,
} from "@bhunter179/chonky"

import { getMediaUrl, navigateToExternalUrl } from "@/ui/utils/common"
import { preview } from "@/ui/utils/previewType"
import { usePreloadFiles } from "@/ui/utils/queryOptions"

export const CustomActions = (path: string) => ({
  DownloadFile: defineFileAction({
    id: "download_file",
    requiresSelection: true,
    fileFilter: (file) => !file?.isDir,
    button: {
      name: "Download",
      contextMenu: true,
      icon: ChonkyIconName.download,
    },
  }),
  RenameFile: defineFileAction({
    id: "rename_file",
    requiresSelection: true,
    button: {
      name: "Rename",
      contextMenu: true,
      icon: ChonkyIconName.rename,
    },
    customVisibility: () =>
      !path ? CustomVisibilityState.Hidden : CustomVisibilityState.Default,
  }),
  DeleteFile: defineFileAction({
    id: "delete_file",
    requiresSelection: true,
    button: {
      name: "Delete",
      contextMenu: true,
      icon: ChonkyIconName.trash,
    },
    customVisibility: () =>
      !path ? CustomVisibilityState.Hidden : CustomVisibilityState.Default,
  }),
  OpenInVLCPlayer: defineFileAction({
    id: "open_vlc_player",
    requiresSelection: true,
    fileFilter: (file) => !file?.isDir && file?.previewType === "video",
    button: {
      name: "Open In VLC",
      contextMenu: true,
      icon: ChonkyIconName.play,
    },
  }),
  CopyDownloadLink: defineFileAction({
    id: "copy_link",
    requiresSelection: true,
    fileFilter: (file) => !file?.isDir,
    button: {
      name: "Copy Download Link",
      contextMenu: true,
      icon: ChonkyIconName.copy,
    },
  }),
  // CreateFolder: (group = "") =>
  //   defineFileAction({
  //     id: "create_folder",
  //     button: {
  //       name: "Create folder",
  //       tooltip: "Create a folder",
  //       toolbar: true,
  //       ...(group && { group }),
  //       icon: ChonkyIconName.folderCreate,
  //     },
  //   }),
})

export const useFileAction = (
  setModalState: SetValue<ModalState>,
  path: string
) => {
  const preloadFiles = usePreloadFiles()

  const fileActions = useMemo(() => CustomActions(path), [path])

  const chonkyActionHandler = useCallback(
    async (data: MapFileActionsToData<ChonkyActionUnion>) => {
      switch (data.id) {
        case ChonkyActions.OpenFiles.id: {
          const { targetFile, files } = data.payload

          const fileToOpen = targetFile ?? files[0]

          if (fileToOpen.isDir) {
            fileToOpen.id === "root"
              ? preloadFiles("")
              : preloadFiles(fileToOpen.path)
          } else if (!fileToOpen.isDir && fileToOpen.previewType in preview) {
            setModalState({
              open: true,
              file: fileToOpen,
              operation: ChonkyActions.OpenFiles.id,
            })
          }
          break
        }
        case fileActions.DownloadFile.id: {
          const { selectedFiles } = data.state
          for (const file of selectedFiles) {
            if (!file.isDir) {
              navigateToExternalUrl(getMediaUrl(file.path), false)
            }
          }
          break
        }
        case fileActions.OpenInVLCPlayer.id: {
          const { selectedFiles } = data.state
          const url = `vlc://${getMediaUrl(selectedFiles[0].path)}`
          navigateToExternalUrl(url, false)
          break
        }
        case fileActions.RenameFile.id: {
          setModalState({
            open: true,
            file: data.state.selectedFiles[0],
            operation: fileActions.RenameFile.id,
          })
          break
        }
        case fileActions.DeleteFile.id: {
          setModalState({
            open: true,
            selectedFiles: data.state.selectedFiles,
            operation: fileActions.DeleteFile.id,
          })
          break
        }
        case ChonkyActions.CreateFolder.id: {
          setModalState({
            open: true,
            operation: ChonkyActions.CreateFolder.id,
          })
          break
        }

        case fileActions.CopyDownloadLink.id: {
          const selections = data.state.selectedFilesForAction
          let clipboardText = ""
          selections.forEach((element) => {
            if (!element.isDir) {
              clipboardText = `${clipboardText}${getMediaUrl(element.path)}\n`
            }
          })
          navigator.clipboard.writeText(clipboardText)
          break
        }
        default:
          break
      }
    },
    [path, fileActions]
  )

  return { fileActions, chonkyActionHandler }
}
