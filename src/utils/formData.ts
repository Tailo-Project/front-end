interface FormDataWithJsonOptions {
    requestKey: string;
    jsonData: Record<string, unknown>;
    files?: { key: string; files: (File | string)[] }[];
}

export const createFormDataWithJson = ({ requestKey, jsonData, files = [] }: FormDataWithJsonOptions): FormData => {
    const formData = new FormData();
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
