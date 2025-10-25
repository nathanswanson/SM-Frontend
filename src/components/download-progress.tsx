import { HStack, Progress, Text, VStack } from '@chakra-ui/react'
import bytes from 'bytes'

interface DownloadProgressProps {
    fileName?: string
    current: number
    total: number
}

export const DownloadProgress = ({ fileName, current, total, ...props }: DownloadProgressProps) => {
    const progress = total > 0 ? (current / total) * 100 : 0

    return (
        <Progress.Root width="100%" minW="15em" height="2em" defaultValue={progress} {...props} striped animated>
            {fileName && (
                <VStack alignItems={'flex-start'}>
                    <Progress.Label maxW="20em">
                        <Text>Downloading: </Text>
                        <Text leftTruncate>{fileName}</Text>
                    </Progress.Label>

                    <HStack width="100%">
                        <Progress.Track flex={1}>
                            <Progress.Range />
                        </Progress.Track>
                        <Progress.ValueText width={'9em'}>{`${bytes(current)} / ${bytes(total)} `}</Progress.ValueText>
                    </HStack>
                </VStack>
            )}
        </Progress.Root>
    )
}
