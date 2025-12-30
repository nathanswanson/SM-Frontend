import { ActionHalo } from '../../components/card/action-halo'
import { CardModuleRaw } from '../../components/card/card'
import { FileTransferProvider } from '../../providers/file-transfer'
import { FileActionBar } from './components/file-action-bar'
import { FileManager } from './components/file-explorer'

export const FileManagerHalo = ({ ...props }) => {
    return (
        <FileTransferProvider>
            <ActionHalo {...props}>
                <ActionHalo.Header>
                    <FileActionBar />
                </ActionHalo.Header>
                <ActionHalo.Contents>
                    <CardModuleRaw flexGrow={1} header="Files" overflow="auto">
                        <FileManager />
                    </CardModuleRaw>
                </ActionHalo.Contents>
            </ActionHalo>
        </FileTransferProvider>
    )
}
