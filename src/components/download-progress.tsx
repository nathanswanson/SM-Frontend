import { HStack, Progress } from '@chakra-ui/react'
import bytes from 'bytes'

interface DownloadProgressProps {
    fileName?: string
    current: number
    total: number
}

export const DownloadProgress = ({ fileName, current, total, ...props }: DownloadProgressProps) => {
    const progress = total > 0 ? (current / total) * 100 : 0

    return (
        <Progress.Root width="100%" defaultValue={progress} {...props} striped animated>
            {fileName && <Progress.Label>{fileName}</Progress.Label>}
            <HStack>
                <Progress.Track flex={1}>
                    <Progress.Range />
                </Progress.Track>
                <Progress.ValueText>{`${bytes(current)} / ${bytes(total)} `}</Progress.ValueText>
            </HStack>
        </Progress.Root>
    )
}
