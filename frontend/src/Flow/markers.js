export const markers = (
  <svg>
    <defs>
      <marker
        id="edge-null"
        viewBox="-5 -5 10 10"
        refX="0"
        refY="0"
        markerUnits="strokeWidth"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <circle
          cx="0"
          cy="0"
          r="2"
          fill="white"
          stroke="black"
          strokeWidth="1"
        />
      </marker>
      <marker
        id="edge-many"
        viewBox="-5 -5 10 10"
        refX="0"
        refY="0"
        markerUnits="strokeWidth"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <path
          d="M 0,0 m -5,-5 L 5,0 L -5,5"
          fill="none"
          stroke="black"
          strokeWidth="1"
        />
      </marker>

      <marker
        id="edge-one"
        viewBox="-5 -5 10 10"
        refX="0"
        refY="0"
        markerUnits="strokeWidth"
        markerWidth="5"
        markerHeight="5"
        orient="auto"
      >
        <path d="M 0,0 L 0,10" fill="none" stroke="black" strokeWidth="1" />
        <path d="M 0,0 L 0,-10" fill="none" stroke="black" strokeWidth="1" />
      </marker>
    </defs>
  </svg>
)
