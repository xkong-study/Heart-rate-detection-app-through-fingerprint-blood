import {sleep} from "antd-mobile/es/utils/sleep";

export async function mockUpload(file: File) {
    return {
        url: URL.createObjectURL(file),
    }
}

export async function mockUploadFail() {
    await sleep(3000)
    throw new Error('Fail to upload')
}
