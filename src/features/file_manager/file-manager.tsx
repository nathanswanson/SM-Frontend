import { HStack } from '@chakra-ui/react/stack'
import { ActionHalo } from '../../components/action-halo'
import { ButtonGroup } from '@chakra-ui/react/button'
import { DownloadProgress } from '../../components/download-progress'
import { CardModuleRaw } from '../../components/card'
import { RiExportFill, RiFileDownloadFill } from 'react-icons/ri'
import CommandButton from '../../components/command-button'
import { FileManager } from './file-explorer'

export const FileManagerHalo = ({ ...props }) => {
    return (
        <ActionHalo {...props}>
            <ActionHalo.Header>
                <HStack justifyContent={'space-between'} width="100%">
                    <ButtonGroup width="100%">
                        <CommandButton label="Export">
                            <RiFileDownloadFill />
                        </CommandButton>
                        <CommandButton label="Upload">
                            <RiExportFill />
                        </CommandButton>
                    </ButtonGroup>
                    <DownloadProgress fileName={''} current={30} total={200} />
                </HStack>
            </ActionHalo.Header>
            <ActionHalo.Contents>
                <CardModuleRaw flexGrow={1} header="Files">
                    <FileManager />
                </CardModuleRaw>
            </ActionHalo.Contents>
        </ActionHalo>
    )
}
