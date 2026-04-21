import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { FaLeaf, FaAward, FaUsers, FaBook } from "react-icons/fa"

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About KrishiDoot</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Empowering farmers with data-driven insights for sustainable agriculture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At KrishiDoot, we're on a mission to revolutionize farming through technology. We believe that by
                combining traditional farming knowledge with modern data science and machine learning, we can help
                farmers make better decisions, increase yields, and practice sustainable agriculture.
              </p>
              <p className="text-gray-600">
                Our platform provides personalized crop recommendations based on soil composition, climate conditions,
                and other environmental factors. We aim to make advanced agricultural science accessible to farmers of
                all sizes, from small family farms to large agricultural operations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card bg-green-50 border-none">
                <div className="flex flex-col items-center justify-center p-6">
                  <FaLeaf className="text-green-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-center">Sustainable Farming</h3>
                </div>
              </div>

              <div className="card bg-green-50 border-none">
                <div className="flex flex-col items-center justify-center p-6">
                  <FaAward className="text-green-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-center">Quality Produce</h3>
                </div>
              </div>

              <div className="card bg-green-50 border-none">
                <div className="flex flex-col items-center justify-center p-6">
                  <FaUsers className="text-green-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-center">Farmer Community</h3>
                </div>
              </div>

              <div className="card bg-green-50 border-none">
                <div className="flex flex-col items-center justify-center p-6">
                  <FaBook className="text-green-500 text-4xl mb-4" />
                  <h3 className="text-xl font-semibold text-center">Knowledge Sharing</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Technology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-500">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Data Collection</h3>
                <p className="text-gray-600">
                  We collect soil data, weather patterns, and historical crop performance to build a comprehensive
                  database.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-500">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Machine Learning</h3>
                <p className="text-gray-600">
                  Our advanced ML models analyze the data to identify patterns and make predictions for optimal farming
                  decisions.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-500">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Insights</h3>
                <p className="text-gray-600">
                  We deliver tailored recommendations directly to farmers through our user-friendly platform.
                </p>
              </div>
            </div>
          </div>

         
          </div>
        
      </main>

      <Footer />
    </div>
  )
}

export default About
