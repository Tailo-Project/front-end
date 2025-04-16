import tailoLogo from "../assets/tailogo.jpg";
import kakaoSymbol from "../assets/kakao_login_medium_narrow.png";

export default function Login() {
    const handleKakaoLogin = async () => {
        // 카카오 로그인 구현
        // console.log("first");
        await fetch("/api/auth/sign-in", {
            headers: {
                "Content-Type": "application/json"
            }
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <div className="mb-16">
                <img
                    src={tailoLogo}
                    alt="Tailo Logo"
                    className="w-[140px] h-[140px]"
                />
            </div>

            <button
                onClick={handleKakaoLogin}
                className="flex items-center justify-center gap-2 w-full max-w-[320px] h-[45px] bg-[#FEE500] rounded-xl text-black text-sm transition-colors"
            >
                <img src={kakaoSymbol} alt="Kakao Symbol" />
            </button>
        </div>
    );
}
