import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import interactiveImg from "../assets/Interactive_lesson.png";
import progressImg from "../assets/Progress_tracking.png";
import communityImg from "../assets/community-support.png";
import khang from "../assets/Khang.jpg";
import khiem from "../assets/Khiem.jpg";
import Thai from "../assets/Thai.jpg";
import Hung from "../assets/Hung.jpg";
import mathImg from "../assets/math.png";
import scienceImg from "../assets/science.png";
import languageImg from "../assets/language.jpg";
import historyImg from "../assets/history.png";


export default function Home() {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col min-h-screen bg-background text-textPrimary font-sans">
            {/* Hero section */}
            <header className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-primary to-secondary text-white">
                <h1 className="text-5xl font-bold mb-4">Welcome to Ecademy</h1>
                <p className="text-lg mb-8 max-w-xl text-center">Your journey to knowledge starts here. Discover, learn, and grow with our all-in-one platform.</p>
                <div className="space-x-4">
                    <Link id="link-to-login-page" to="/login">
                        <button className="bg-white text-primary font-semibold py-2 px-6 rounded shadow hover:bg-gray-200 transition duration-300">
                            {user ? "Logout" : "Login"}
                        </button>
                    </Link>
                    {!user && (
                        <Link to="/register">
                            <button className="bg-transparent border border-white text-white py-2 px-6 rounded hover:bg-white hover:text-primary transition duration-300">
                                Register
                            </button>
                        </Link>
                    )}
                </div>
            </header>

            {/* Features section */}
            <section className="py-16 px-6 bg-gray-100">
                <h2 className="text-3xl font-semibold text-center mb-12">Why choose Ecademy?</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {/* Card 1 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow bg-white w-72">
                        <h3 className="text-xl font-bold mb-2">Interactive Lessons</h3>
                        <img
                            src={interactiveImg}
                            alt="Interactive"
                            className="h-40 w-full object-contain mb-4"
                        />
                        <p className="text-sm text-gray-700">
                            Engaging content tailored to your learning style.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow bg-white w-72">
                        <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                        <img
                            src={progressImg}
                            alt="Progress"
                            className="h-40 w-full object-contain mb-4"
                        />
                        <p className="text-sm text-gray-700">
                            Monitor your growth with smart analytics and feedback.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow bg-white w-72">
                        <h3 className="text-xl font-bold mb-2">Community Support</h3>
                        <img
                            src={communityImg}
                            alt="Community"
                            className="h-40 w-full object-contain mb-4"
                        />
                        <p className="text-sm text-gray-700">
                            Join a supportive network of students and educators.
                        </p>
                    </div>
                </div>
            </section>


            {/* Subject section */}
            <section className="py-16 px-6 bg-white">
                <h2 className="text-3xl font-semibold text-center mb-12">Subject</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {/* subject cards */}
                    {/* card 1 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow bg-white w-72">
                        <h3 className="text-xl font-bold mb-2">Math</h3>
                        <img
                            src={mathImg}
                            alt="Math"
                            className="h-40 w-full object-contain mb-4"
                        />
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow bg-white w-72">
                        <h3 className="text-xl font-bold mb-2">Science</h3>
                        <img
                            src={scienceImg}
                            alt="Science"
                            className="h-40 w-full object-contain mb-4"
                        />
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow bg-white w-72">
                        <h3 className="text-xl font-bold mb-2">History</h3>
                        <img
                            src={historyImg}
                            alt="History"
                            className="h-40 w-full object-contain mb-4"
                        />
                    </div>

                    {/* Card 4 */}
                    <div className="flex flex-col items-center text-center p-6 rounded-lg shadow bg-white w-72">
                        <h3 className="text-xl font-bold mb-2">Language</h3>
                        <img
                            src={languageImg}
                            alt="language"
                            className="h-40 w-full object-contain mb-4"
                        />
                    </div>
                </div>
            </section>


            {/* About Us */}
            <section className="bg-primary text-black py-16 px-6 text-center">
                <h2 className="text-3xl font-semibold mb-12 text-white">About Us</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {/* Card 1 */}
                    <div className="w-64 h-[340px] bg-white rounded-lg shadow flex flex-col items-center justify-between p-4">
                        <h3 className="text-lg font-bold">Tran Hoang Khiem</h3>
                        <img src={khiem} alt="Tran Hoang Khiem" className="w-28 h-28 rounded-full object-cover my-2" />
                        <p className="italic text-sm">s3966954</p>
                        <p className="text-sm">Project Manager</p>
                    </div>

                    {/* Card 2 */}
                    <div className="w-64 h-[340px] bg-white rounded-lg shadow flex flex-col items-center justify-between p-4">
                        <h3 className="text-lg font-bold">Quan Hung</h3>
                        <img src={Hung} alt="Quan Hung" className="w-28 h-28 rounded-full object-cover my-2" />
                        <p className="italic text-sm">s3980813</p>
                        <p className="text-sm">Frontend Developer</p>
                    </div>

                    {/* Card 3 */}
                    <div className="w-64 h-[340px] bg-white rounded-lg shadow flex flex-col items-center justify-between p-4">
                        <h3 className="text-lg font-bold">Nguyen Tu Quoc Thai</h3>
                        <img src={Thai} alt="Nguyen Tu Quoc Thai" className="w-28 h-28 rounded-full object-cover my-2" />
                        <p className="italic text-sm">s3957050</p>
                        <p className="text-sm">Backend Developer</p>
                    </div>

                    {/* Card 4 */}
                    <div className="w-64 h-[340px] bg-white rounded-lg shadow flex flex-col items-center justify-between p-4">
                        <h3 className="text-lg font-bold">Tran Nguyen Khang</h3>
                        <img src={khang} alt="Tran Nguyen Khang" className="w-28 h-28 rounded-full object-cover my-2" />
                        <p className="italic text-sm">s3935748</p>
                        <p className="text-sm">Data Engineer</p>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer footer className="py-6 bg-gray-900 text-center text-white mt-auto" >
                <p>&copy; {new Date().getFullYear()} Ecademy. All rights reserved.</p>
            </footer >
        </div >
    );
}