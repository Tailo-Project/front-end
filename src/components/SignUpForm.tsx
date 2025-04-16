import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions
} from "@headlessui/react";
import tailoLogo from "../assets/tailogo.svg";
import { ChevronUpDownIcon, PlusIcon } from "@heroicons/react/24/outline";

interface FormData {
    nickname: string;
    userId: string;
    profileImage: File | null;
    type: string;
    breed: string;
    gender: "male" | "female";
    age: string;
    location: string;
}

// 임시 품종 데이터
const initialBreeds = [
    "말티즈",
    "포메라니안",
    "치와와",
    "푸들",
    "시바견",
    "말라뮤트"
];

export default function SignUpForm() {
    const [query, setQuery] = useState("");
    const [breeds, setBreeds] = useState(initialBreeds);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [showAddBreed, setShowAddBreed] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { isValid },
        setValue
    } = useForm<FormData>({
        mode: "onChange"
    });

    const filteredBreeds =
        query === ""
            ? breeds
            : breeds.filter((breed) =>
                  breed.toLowerCase().includes(query.toLowerCase())
              );

    const onSubmit = (data: FormData) => {
        console.log(data);
    };

    const handleAddBreed = () => {
        if (query && !breeds.includes(query)) {
            setBreeds([...breeds, query]);
            setSelectedBreed(query);
            setValue("breed", query);
            setShowAddBreed(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
            setValue("profileImage", file);
        }
    };

    const inputClassName =
        "flex-1 h-[32px] px-2 text-sm border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 placeholder:text-gray-400 placeholder:text-xs hover:border-gray-400 bg-gray-50/30";
    const labelClassName =
        "text-sm font-medium w-[49px] text-gray-700 select-none";

    return (
        <div className="flex flex-col items-start justify-start min-h-screen bg-white px-4 py-6">
            <h1 className="text-xl font-medium mb-8 flex items-center gap-2 mx-auto">
                회원가입 |{" "}
                <span className="text-blue-500">추가 정보를 입력해주세요.</span>
            </h1>

            <div className="w-full max-w-[320px] mx-auto">
                <div className="mb-8">
                    <img
                        src={tailoLogo}
                        alt="Tailo Logo"
                        className="w-[140px] h-[140px] mx-auto"
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-5">
                        <div>
                            <p className="text-sm font-medium mb-2">
                                프로필 사진
                            </p>
                            <div className="relative w-[100px] h-[100px] mx-auto">
                                <input
                                    type="file"
                                    accept="image/jpg, image/png"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="profileImage"
                                />
                                <label
                                    htmlFor="profileImage"
                                    className="block w-full h-full rounded-full border-2 border-dashed border-gray-300 cursor-pointer overflow-hidden"
                                >
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                            <PlusIcon className="w-6 h-6" />
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={labelClassName}>
                                닉네임<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("nickname", { required: true })}
                                className={inputClassName}
                                placeholder="반려동물의 프로필에 사용 될 닉네임을 적어주세요"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={labelClassName}>
                                아이디<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("userId", { required: true })}
                                className={inputClassName}
                                placeholder="사용하실 아이디를 적어주세요"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={labelClassName}>
                                종류<span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2 flex-1">
                                <input
                                    type="text"
                                    {...register("type", { required: true })}
                                    className={inputClassName}
                                    placeholder="ex) 강아지, 고양이, 햄스터"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={labelClassName}>품종</label>
                            <div className="flex-1">
                                <Combobox
                                    value={selectedBreed}
                                    onChange={(value: string) => {
                                        setSelectedBreed(value || "");
                                        setValue("breed", value || "");
                                    }}
                                >
                                    <div className="relative">
                                        <ComboboxInput
                                            className={inputClassName}
                                            onChange={(event) => {
                                                setQuery(event.target.value);
                                                setShowAddBreed(
                                                    event.target.value !== "" &&
                                                        !filteredBreeds.includes(
                                                            event.target.value
                                                        )
                                                );
                                            }}
                                            displayValue={(breed: string) =>
                                                breed
                                            }
                                            placeholder="품종을 선택해주세요"
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center">
                                            <ChevronUpDownIcon className="h-4 w-4 text-gray-400" />
                                        </ComboboxButton>
                                        <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black/5 overflow-auto focus:outline-none">
                                            {filteredBreeds.map((breed) => (
                                                <ComboboxOption
                                                    key={breed}
                                                    value={breed}
                                                    className={({ active }) =>
                                                        `cursor-default select-none relative py-2.5 pl-3 pr-9 ${
                                                            active
                                                                ? "text-white bg-blue-500"
                                                                : "text-gray-900"
                                                        }`
                                                    }
                                                >
                                                    {({ selected }) => (
                                                        <span
                                                            className={`block truncate ${
                                                                selected
                                                                    ? "font-medium"
                                                                    : "font-normal"
                                                            }`}
                                                        >
                                                            {breed}
                                                        </span>
                                                    )}
                                                </ComboboxOption>
                                            ))}
                                            {showAddBreed && (
                                                <button
                                                    type="button"
                                                    onClick={handleAddBreed}
                                                    className="flex items-center w-full px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                                                >
                                                    <PlusIcon className="h-4 w-4 mr-2" />
                                                    <span>
                                                        "{query}" 추가하기
                                                    </span>
                                                </button>
                                            )}
                                        </ComboboxOptions>
                                    </div>
                                </Combobox>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={labelClassName}>성별</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        {...register("gender")}
                                        value="male"
                                        className="w-3.5 h-3.5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-600">
                                        남
                                    </span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        {...register("gender")}
                                        value="female"
                                        className="w-3.5 h-3.5 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <span className="text-sm text-gray-600">
                                        여
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={labelClassName}>
                                나이<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("age", { required: true })}
                                className={inputClassName}
                                placeholder="반려동물의 나이를 적어주세요"
                            />
                            세
                        </div>

                        <div className="flex items-center gap-3">
                            <label className={labelClassName}>
                                거주지<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("location", { required: true })}
                                className={inputClassName}
                                placeholder="거주지를 적어주세요"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid}
                        className={`w-full h-[45px] rounded-xl text-white transition-all duration-300 ${
                            isValid
                                ? "bg-[#FF785D] hover:bg-[#FF785D]/80 hover:shadow-md"
                                : "bg-[#FFD1BA] cursor-not-allowed"
                        }`}
                    >
                        가입완료
                    </button>
                </form>
            </div>
        </div>
    );
}
