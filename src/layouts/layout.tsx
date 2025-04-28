import TabBar from '@/components/TabBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <div className="w-full max-w-[375px] md:max-w-[600px] lg:max-w-[900px] mx-auto bg-white min-h-screen pb-16">
                {children}
            </div>
            <TabBar />
        </div>
    );
};

export default Layout;
