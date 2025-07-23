import Link from "next/link"

export function WhyChooseSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-6 md:px-8 max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
            WHY CHOOSE CRC ELECTRIC?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
            For over 10 years, CRC Electric has proudly served Suffolk and Nassau County with expert residential and commercial electrical work. Known for dependable service, clean installations, and attention to detail, CRC has earned a strong reputation — backed by 5-star reviews from satisfied clients on{" "}
            <a 
              href="https://www.thumbtack.com/ny/holtsville/electrical-repairs/631o764o1577-call-now-free-crc-electric/service/479758200800878593"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-700 font-medium no-underline"
            >
              Thumbtack
            </a>.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 rounded-full text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Get Your Free Estimate! ➜
          </Link>
        </div>
      </div>
    </section>
  )
}
