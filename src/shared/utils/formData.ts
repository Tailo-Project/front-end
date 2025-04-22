interface FormDataWithJsonOptions {
    requestKey: string;
    jsonData: Record<string, unknown>;
    files?: { key: string; files: File[] }[];
}

export const createFormDataWithJson = ({ requestKey, jsonData, files = [] }: FormDataWithJsonOptions): FormData => {
    const formData = new FormData();

    // JSON 데이터를 Blob으로 변환하여 추가
    const blob = new Blob([JSON.stringify(jsonData)], { type: 'application/json' });
    formData.append(requestKey, blob);

    // 파일 데이터 추가
    files.forEach(({ key, files: fileList }) => {
        fileList.forEach((file) => {
            formData.append(key, file);
        });
    });

    return formData;
};
