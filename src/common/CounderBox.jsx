import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const CounterBox = ({ value, label }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div
      ref={ref}
      className="w-[90%] xsm:w-[80%]  p-6 rounded-3xl shadow-lg bg-gradient-to-br from-red-100 to-white border border-red-200 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center"
    >
      <p className="text-4xl lg:text-4xl font-bold text-red-700 drop-shadow-sm">
        <CountUp start={0} end={inView ? value : 0} duration={3} delay={0.2} />+
      </p>
      <p className="mt-2 text-base sm:text-lg text-gray-700 font-medium">
        {label}
      </p>
    </div>
  );
};

export default CounterBox;
