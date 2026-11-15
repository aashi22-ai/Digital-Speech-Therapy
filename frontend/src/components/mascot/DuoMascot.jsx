import React from "react";

/**
 * Penguin Mascot Component (replaces Owl)
 * Features an adorable baby penguin with blue-and-white winter scarf,
 * big anime eyes, rosy blush cheeks, orange webbed feet, and mood animations.
 */
export default function DuoMascot({
  mood = "idle",
  size = "md",
  message = "",
  className = "",
  usePhoto = false,
}) {
  const sizeMap = {
    sm: "w-16 h-16",
    md: "w-28 h-28",
    lg: "w-40 h-40",
    xl: "w-56 h-56",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Mascot Graphic */}
      <div className={`relative ${sizeMap[size]} shrink-0 transition-transform duration-300`}>
        {usePhoto ? (
          <img
            src="/penguin.png"
            alt="Penguin Mascot"
            className="w-full h-full object-contain drop-shadow-md select-none rounded-full"
          />
        ) : (
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-md select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Ground shadow */}
            <ellipse cx="100" cy="184" rx="48" ry="10" fill="#E2E8F0" />

            {/* Feet (Orange with 3 toes) */}
            <g id="feet">
              {/* Left Foot */}
              <path
                d="M72 176 C65 174 58 178 60 184 C62 188 74 190 86 186 C90 184 88 178 82 176 Z"
                fill="#E06D14"
              />
              <path
                d="M72 174 C65 172 59 176 61 181 C63 185 75 187 85 183 C89 181 87 175 81 174 Z"
                fill="#FF9326"
              />
              {/* Right Foot */}
              <path
                d="M128 176 C135 174 142 178 140 184 C138 188 126 190 114 186 C110 184 112 178 118 176 Z"
                fill="#E06D14"
              />
              <path
                d="M128 174 C135 172 141 176 139 181 C137 185 125 187 115 183 C111 181 113 175 119 174 Z"
                fill="#FF9326"
              />
            </g>

            {/* Flippers (Arms) */}
            <g id="flippers">
              {mood === "cheering" ? (
                <>
                  {/* Left Flipper raised high */}
                  <path
                    d="M66 98 C46 80 28 62 30 52 C32 44 44 50 62 76 C68 84 70 94 66 98 Z"
                    fill="#252B37"
                  />
                  {/* Right Flipper raised high */}
                  <path
                    d="M134 98 C154 80 172 62 170 52 C168 44 156 50 138 76 C132 84 130 94 134 98 Z"
                    fill="#252B37"
                  />
                </>
              ) : mood === "listening" ? (
                <>
                  {/* Flippers holding headphones */}
                  <path
                    d="M66 106 C50 102 38 88 42 78 C46 68 56 74 68 88 C72 94 72 102 66 106 Z"
                    fill="#252B37"
                  />
                  <path
                    d="M134 106 C150 102 162 88 158 78 C154 68 144 74 132 88 C128 94 128 102 134 106 Z"
                    fill="#252B37"
                  />
                </>
              ) : mood === "thinking" ? (
                <>
                  {/* Left Flipper to chin */}
                  <path
                    d="M66 112 C52 110 48 94 54 86 C60 78 72 84 76 98 C78 106 74 112 66 112 Z"
                    fill="#252B37"
                  />
                  {/* Right Flipper natural */}
                  <path
                    d="M136 106 C154 110 172 118 168 128 C164 136 150 132 134 120 C130 116 130 110 136 106 Z"
                    fill="#252B37"
                  />
                </>
              ) : (
                <>
                  {/* Normal happy open flippers */}
                  <path
                    d="M64 106 C46 108 28 102 32 92 C36 82 52 86 68 96 C72 100 70 105 64 106 Z"
                    fill="#252B37"
                  />
                  <path
                    d="M136 106 C154 108 172 102 168 92 C164 82 148 86 132 96 C128 100 130 105 136 106 Z"
                    fill="#252B37"
                  />
                </>
              )}
            </g>

            {/* Main Outer Body (Charcoal Slate #2C3342) */}
            <g id="body">
              {/* Head feather tuft */}
              <path
                d="M96 28 C94 18 99 12 102 16 C105 10 110 14 106 28 Z"
                fill="#252B37"
              />

              {/* Head + Body Egg shape */}
              <path
                d="M100 24 C62 24 48 52 48 96 C48 140 64 178 100 178 C136 178 152 140 152 96 C152 52 138 24 100 24 Z"
                fill="#2C3342"
              />

              {/* Body depth bottom contour */}
              <path
                d="M52 120 C58 155 76 176 100 176 C124 176 142 155 148 120 C142 148 124 168 100 168 C76 168 58 148 52 120 Z"
                fill="#1E232F"
              />
            </g>

            {/* White Face & Chest Mask */}
            <g id="white-patch">
              {/* White Face Mask */}
              <path
                d="M100 40 C76 40 60 52 60 76 C60 96 74 106 100 106 C126 106 140 96 140 76 C140 52 124 40 100 40 Z"
                fill="#FFFFFF"
              />
              {/* White Tummy Belly */}
              <ellipse cx="100" cy="144" rx="34" ry="26" fill="#FFFFFF" />
            </g>

            {/* Rosy Blush Cheeks */}
            <ellipse cx="70" cy="85" rx="8" ry="5" fill="#FFA3A9" opacity="0.85" />
            <ellipse cx="130" cy="85" rx="8" ry="5" fill="#FFA3A9" opacity="0.85" />

            {/* Eyes */}
            <g id="eyes">
              {mood === "cheering" ? (
                <>
                  {/* Cheerful inverted arc eyes ^^ */}
                  <path
                    d="M68 76 C72 64 84 64 88 76"
                    stroke="#1E232F"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M112 76 C116 64 128 64 132 76"
                    stroke="#1E232F"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </>
              ) : mood === "sad" ? (
                <>
                  {/* Sad watery eyes */}
                  <ellipse cx="78" cy="74" rx="9" ry="11" fill="#1E232F" />
                  <ellipse cx="122" cy="74" rx="9" ry="11" fill="#1E232F" />
                  <circle cx="75" cy="70" r="4" fill="white" />
                  <circle cx="119" cy="70" r="4" fill="white" />
                  {/* Teardrop */}
                  <circle cx="68" cy="88" r="3.5" fill="#55ACEE" />
                </>
              ) : mood === "encouraging" ? (
                <>
                  {/* Left eye wink ;) */}
                  <path
                    d="M70 75 C74 70 82 70 86 75"
                    stroke="#1E232F"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                  {/* Right eye wide */}
                  <ellipse cx="122" cy="74" rx="10" ry="12" fill="#1E232F" />
                  <circle cx="119" cy="70" r="4.5" fill="white" />
                  <circle cx="125" cy="78" r="2" fill="white" />
                </>
              ) : (
                <>
                  {/* Normal Big Cartoon Anime Eyes */}
                  <ellipse cx="78" cy="74" rx="10" ry="12" fill="#1E232F" />
                  <ellipse cx="122" cy="74" rx="10" ry="12" fill="#1E232F" />
                  {/* Big primary reflection */}
                  <circle cx="75" cy="70" r="4.5" fill="white" />
                  <circle cx="119" cy="70" r="4.5" fill="white" />
                  {/* Small secondary reflection */}
                  <circle cx="81" cy="78" r="2" fill="white" />
                  <circle cx="125" cy="78" r="2" fill="white" />
                </>
              )}

              {/* Little cute eyebrows */}
              <path
                d="M72 58 C76 56 82 58 84 60"
                stroke="#252B37"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M116 60 C118 58 124 56 128 58"
                stroke="#252B37"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Beak & Mouth */}
            <g id="beak">
              {mood === "speaking" ? (
                <>
                  {/* Open speaking mouth */}
                  <path
                    d="M86 82 C86 82 100 76 114 82 C114 96 100 104 86 82 Z"
                    fill="#FF9326"
                  />
                  <ellipse cx="100" cy="89" rx="8" ry="6" fill="#8B1E1E" />
                  <ellipse cx="100" cy="91" rx="5" ry="3" fill="#FF6B6B" />
                </>
              ) : (
                <>
                  {/* Cheerful rounded beak */}
                  <path
                    d="M86 82 C86 82 100 76 114 82 C114 94 100 100 86 82 Z"
                    fill="#FF9326"
                  />
                  {/* Smile seam */}
                  <path
                    d="M88 84 C96 88 104 88 112 84"
                    stroke="#E06D14"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  {/* Open bottom happy tongue */}
                  <path
                    d="M93 88 C97 94 103 94 107 88"
                    fill="#FF6B6B"
                  />
                </>
              )}
            </g>

            {/* Blue & White Striped Winter Scarf (Signature look!) */}
            <g id="scarf">
              {/* Main neck scarf band */}
              <path
                d="M62 102 C74 106 126 106 138 102 C142 108 140 118 136 122 C124 126 76 126 64 122 C60 118 58 108 62 102 Z"
                fill="#4FA3E8"
              />
              {/* Scarf white stripes */}
              <path d="M76 104 L74 124 L84 125 L86 104 Z" fill="#FFFFFF" />
              <path d="M96 105 L96 125 L106 125 L106 105 Z" fill="#FFFFFF" />
              <path d="M118 104 L116 124 L126 123 L127 103 Z" fill="#FFFFFF" />

              {/* Scarf tail draping down right */}
              <path
                d="M120 114 C120 114 128 116 134 120 C138 126 136 146 134 152 C126 154 120 152 118 144 C116 134 116 120 120 114 Z"
                fill="#4FA3E8"
              />
              {/* Scarf tail white stripes */}
              <path d="M118 128 L136 130 L135 137 L117 135 Z" fill="#FFFFFF" />
              <path d="M118 142 L134 144 L133 148 L117 146 Z" fill="#FFFFFF" />
              {/* Scarf fringe */}
              <line x1="120" y1="152" x2="120" y2="157" stroke="#252B37" strokeWidth="1.5" />
              <line x1="124" y1="153" x2="124" y2="158" stroke="#252B37" strokeWidth="1.5" />
              <line x1="128" y1="153" x2="128" y2="158" stroke="#252B37" strokeWidth="1.5" />
              <line x1="132" y1="152" x2="132" y2="157" stroke="#252B37" strokeWidth="1.5" />
            </g>

            {/* Listening Headphones Accessory */}
            {mood === "listening" && (
              <g id="headphones">
                {/* Headband arch */}
                <path
                  d="M48 64 C48 24 72 10 100 10 C128 10 152 24 152 64"
                  stroke="#FFC800"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                {/* Left headphone cushion */}
                <rect x="40" y="52" width="16" height="30" rx="8" fill="#1CB0F6" />
                <rect x="42" y="55" width="12" height="24" rx="6" fill="#FFC800" />
                {/* Right headphone cushion */}
                <rect x="144" y="52" width="16" height="30" rx="8" fill="#1CB0F6" />
                <rect x="146" y="55" width="12" height="24" rx="6" fill="#FFC800" />
                {/* Music note */}
                <text x="160" y="44" fontSize="18" fill="#FFC800" fontWeight="bold">
                  ♪
                </text>
              </g>
            )}

            {/* Cheering Party Hat & Stars */}
            {mood === "cheering" && (
              <g id="celebration">
                <polygon points="100,2 84,32 116,32" fill="#FFC800" />
                <polygon points="100,2 92,32 116,32" fill="#E5A500" />
                <circle cx="100" cy="3" r="4.5" fill="#FF4B4B" />
                {/* Golden Confetti Stars */}
                <path
                  d="M26 36 L29 44 L37 45 L31 50 L33 58 L26 53 L19 58 L21 50 L15 45 L23 44 Z"
                  fill="#FFC800"
                />
                <path
                  d="M174 36 L177 44 L185 45 L179 50 L181 58 L174 53 L167 58 L169 50 L163 45 L171 44 Z"
                  fill="#FFC800"
                />
              </g>
            )}
          </svg>
        )}
      </div>

      {/* Mascot Speech Bubble */}
      {message && (
        <div className="relative bg-white border-2 border-duo-gray rounded-2xl px-4 py-3 shadow-sm max-w-sm">
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-duo-gray" />
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-7 border-t-transparent border-b-7 border-b-transparent border-r-7 border-r-white" />
          <p className="text-sm font-bold text-duo-dark leading-snug">{message}</p>
        </div>
      )}
    </div>
  );
}
