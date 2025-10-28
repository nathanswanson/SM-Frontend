import { HStack, Presence, Progress, Text, VStack } from '@chakra-ui/react'
import bytes from 'bytes'
import { Tooltip } from '../../lib/chakra/tooltip'
import { useFileTransferContext } from '../providers/file-transfer'
import { titleCaseString } from '../utils/util'

export const DownloadProgress = ({ ...props }) => {
    const { file, transferProgress } = useFileTransferContext()

    if (!file) {
        return <></>
    }
    const progress = (transferProgress / file.sizeTotal) * 100
    return (
        <Presence
            present={progress < 100}
            animationDuration={'slow'}
            animationDelay={'slow'}
            animationName={{ _open: 'fade-in', _closed: 'fade-out' }}
        >
            <Progress.Root width="100%" minW="20em" height="2em" value={progress} {...props} striped animated>
                <VStack alignItems={'flex-start'}>
                    <Progress.Label maxW="20em">
                        <Text>{titleCaseString(file.direction)}: </Text>
                        <Tooltip content={file.fileName}>
                            <Text leftTruncate>{file.fileName}</Text>
                        </Tooltip>
                    </Progress.Label>

                    <HStack width="100%">
                        <Progress.Track flex={1}>
                            <Progress.Range />
                        </Progress.Track>
                        <Progress.ValueText
                            textWrap={'nowrap'}
                            width={'9em'}
                        >{`${bytes(transferProgress, { decimalPlaces: 0 })} / ${bytes(file.sizeTotal, { decimalPlaces: 0 })}`}</Progress.ValueText>
                    </HStack>
                </VStack>
            </Progress.Root>
        </Presence>
    )
}
