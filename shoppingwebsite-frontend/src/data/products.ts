import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'n20-12v-300rpm-encoder',
    name: 'N20 12V 300RPM Micro Metal Gear Motor with Magnetic Hall Encoder',
    sku: 'MOT-N20-12V-300E',
    category: 'Motors & Drivers',
    subCategory: 'Micro Metal Gear Motors',
    price: 365,
    originalPrice: 440,
    hsn: '85011019',
    gstRate: 18,
    stock: 142,
    rating: 4.8,
    reviewsCount: 38,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0jHiFhzcyrFgJgyr2JGnA-MA0qfoSEqiw2nll3M7zYpo4FfhZMOt0LZqLOiJkRjls09xH8rCqZf29RPN8lTZcnrVuy9e-9pNt_q9vf35L5QPlEZBAK5V6H9wnrMa9HCfeDqh6-x6FsXLtVNLOEmn2IRKFdszN8Movn0r2N87BFmGQzISC2K7uU0qHvqJtFQr54SrVgv2BvpG4HaxLKt-zbiCeoq3tScb1zhEA15I3CSVvtmADPTfd',
    gallery: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB0jHiFhzcyrFgJgyr2JGnA-MA0qfoSEqiw2nll3M7zYpo4FfhZMOt0LZqLOiJkRjls09xH8rCqZf29RPN8lTZcnrVuy9e-9pNt_q9vf35L5QPlEZBAK5V6H9wnrMa9HCfeDqh6-x6FsXLtVNLOEmn2IRKFdszN8Movn0r2N87BFmGQzISC2K7uU0qHvqJtFQr54SrVgv2BvpG4HaxLKt-zbiCeoq3tScb1zhEA15I3CSVvtmADPTfd',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB_H8nM7sfHzyNtPE_MNCIAaoh9v0_iIC6JA_I1TNxDgWCXxhZ8zE_M-yxOYL8HImgVxQLU9VUlJcXdyhglpSsSUgmfcRYXdn_PE2uSsH2DUtWLup5p6yb9HoVepUbL_icWcNuM5cCu01hxUexhTwDc3uG6Z1JcLLrUxdPQpaYOo6MfhUxqxDb5h8-wZX1WE1cd7EU3TV_pMBmMmcgGTnj7YfzDxqrXBoPqiqbL3RuB7OkCfSjmXE97',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBR1DoZRYhp0pPQdVCOvy_kBuD9GV9R6qaDTa_ZE2DWlyKEpjtTAkLboHSPfSWeDwTkSdcN3hXf_tsUcRGzptA5CSetvgKl3BEvGXC9oj6-zfAFpHQDMXGgMdDuo9mHP8guwpnRWAkhker2bCCNeIVrwzrCiBtGASrqVUolwNzK3Ina5QXMMo2JpnqMQAgbExGzliry__itBbVS5Sc7479yx59P14TMUFGU8bBQYV8ckDKmy6Hqi-kD',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCkfCYe6rhL5P_LBu8FoyQ42UY1JBo2ASd36LDlxjVPIEsOkk7mU59cOdOovR-RMnw3QBntu5p683gKTmvtWJ_fWSX-JyildWG4CnbV9cJTi6HntbJe9gWoq3qn6WNxUl5lcjgUX5a5hEKeBsJQdgSvefKTcTJ7j1MPmkRQkVlhSlxU1IqNGRFZpEt5dfoy1AbT2xopQrg1jynqlMpFi24l1hO-o_SBRUm3ph0utvbhq_Q5bxak_52U',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAQRXpdhtYieJ1jIdWwduCQfzR5y1MZG10pvWTLTk9HVe-cjX-vKS5TP1LOy2z8PwY-A4f3hzvT2pqLU41dA4Nr_qohSJRweypPLw1rDpKpFnNLylYC9EnNMvbAhpw9VBu5J8b_n1eI3HdP-qiJyHHLyoFL534GNAaPchdm_iKSs5SkzwqCmZLgEmpAqzMyVjJhdgt70L7Gl2x9hKqWYR19IGk9rFJMDYwTzVBWciZRUKJsBx1b5Cx4',
    ],
    description: 'Precision engineered N20 micro metal gear motor operating at 12V DC with 300 RPM output. Integrates a dual-channel magnetic Hall encoder delivering 7 PPR (pulses per revolution) on the motor shaft, enabling ultra-precise closed-loop velocity and position control in micromouse, robotic arms, and medical automation prototypes.',
    features: [
      'Dual-channel quadrature magnetic Hall encoder with pull-up resistors',
      'High-grade brass and hardened alloy all-metal spur gearbox',
      'Standard D-shaped output shaft (3mm diameter, 10mm length)',
      'Compact footprint: 12mm x 10mm cross section, 36mm total length',
      'Pre-crimped 6-pin JST-SH 1.0mm pitch ribbon connector included'
    ],
    brand: 'Pololu Compatible',
    voltage: '12V',
    rpm: 300,
    shaftType: '3mm D-Shaft',
    encoder: true,
    tierPricing: [
      { minQty: 1, maxQty: 9, price: 365, savings: 'Standard' },
      { minQty: 10, maxQty: 49, price: 342, savings: 'Save 6%' },
      { minQty: 50, maxQty: 99, price: 320, savings: 'Save 12%' },
      { minQty: 100, price: 298, savings: 'Save 18%' },
    ],
    specifications: {
      'Operating Voltage': '6V - 12V DC (Nominal 12V)',
      'No-Load Speed': '300 RPM @ 12V',
      'No-Load Current': '45 mA',
      'Stall Torque': '0.8 kg.cm (78 mN.m)',
      'Stall Current': '0.7 A',
      'Gear Ratio': '1:50',
      'Encoder Resolution': '7 PPR (350 Counts per Gearbox Rev)',
      'Shaft Diameter': '3.0 mm (D-Cut 2.5mm)',
      'Shaft Length': '9.3 mm',
      'Weight': '14.5 grams'
    },
    pinout: [
      { pin: 'M1', color: 'Red', function: 'Motor Power (+)', description: 'Connects to motor driver H-Bridge terminal A (Polarity reversible)' },
      { pin: 'GND', color: 'Black', function: 'Encoder Ground (-)', description: '0V reference for Hall sensors logic circuit' },
      { pin: 'C1', color: 'Yellow', function: 'Encoder Phase A', description: 'Digital square wave output channel A with 10kΩ pull-up' },
      { pin: 'C2', color: 'Green', function: 'Encoder Phase B', description: 'Digital square wave output channel B (90° phase shift)' },
      { pin: 'VCC', color: 'Blue', function: 'Encoder Power (+)', description: 'Regulated 3.3V to 5.0V DC sensor supply' },
      { pin: 'M2', color: 'White', function: 'Motor Power (-)', description: 'Connects to motor driver H-Bridge terminal B' },
    ],
    packageIncludes: [
      '1 x N20 12V 300RPM Micro Metal Gear Motor with Magnetic Encoder',
      '1 x 6-Pin 15cm JST-SH Ribbon Connection Cable',
      '1 x M1.6 Mounting Hardware Set'
    ],
    datasheetUrl: 'https://spaceborn.in/wp-content/uploads/2026/datasheets/N20-12V-300RPM-Encoder-DS.pdf',
    cadModelUrl: 'https://spaceborn.in/wp-content/uploads/2026/cad/N20_Gearmotor_Assembly.step',
    badge: 'Best Seller'
  },
  {
    id: 'esp32-wroom-32d',
    name: 'ESP32-WROOM-32D Dual-Core Wi-Fi & Bluetooth MCU Module (PCB Antenna)',
    sku: 'MCU-ESP32-32D-MOD',
    category: 'Development Boards',
    subCategory: 'Wireless & IoT Modules',
    price: 185,
    originalPrice: 245,
    hsn: '85423100',
    gstRate: 18,
    stock: 580,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnMVjJT1-pt_AUMIcro80-s0aL2aPVMCoDou9qgbwJANIBVazQ1s39mu2vq1BLesHXaAFSkkpALE_XVjtV3y7azHza4PJbe25tANLFpKG6RPVKvXpoQ_qya7IRJBaN2UcX9MS9fdjvLIdfp1rIlUtIsMMiIjI8RtrobB9REuUC-iURkIpotv160m7Satr4zsxsEt0Inn5LEXj8WMRXDP7zFsw-WcZJ9_KnlsHly_uVy_3HVRHTksl8',
    description: 'Espressif official ESP32-WROOM-32D module featuring the ESP32-D0WD chip. Offers high computing power with dual Xtensa 32-bit LX6 microprocessors running up to 240 MHz, integrated 4MB SPI flash, Wi-Fi 802.11 b/g/n, and Bluetooth 4.2 BR/EDR and BLE.',
    features: [
      'Dual-core 240MHz Xtensa 32-bit LX6 microprocessors',
      '520 KB SRAM, 448 KB ROM, and 4 MB external QSPI Flash',
      'Wi-Fi 802.11 b/g/n (up to 150 Mbps) and Bluetooth v4.2 BR/EDR & BLE',
      'Ultra-low power co-processor for sensor threshold wakeups'
    ],
    brand: 'Espressif Systems',
    tierPricing: [
      { minQty: 1, maxQty: 9, price: 185, savings: 'Standard' },
      { minQty: 10, maxQty: 49, price: 172, savings: 'Save 7%' },
      { minQty: 50, price: 158, savings: 'Save 15%' },
    ],
    specifications: {
      'Clock Frequency': 'Up to 240 MHz',
      'Operating Voltage': '3.0V ~ 3.6V DC',
      'Operating Current': 'Average: 80 mA',
      'Flash Memory': '4 MB SPI Flash',
      'Wireless Connectivity': 'Wi-Fi 2.4 GHz + BT 4.2 BLE',
      'Antenna': 'On-board MIFA PCB trace antenna'
    },
    packageIncludes: [
      '1 x ESP32-WROOM-32D SMD Wireless Microcontroller Module'
    ],
    badge: 'Popular'
  },
  {
    id: 'a4988-stepper-driver',
    name: 'A4988 Stepper Motor Driver Module with Anodized Aluminum Heatsink',
    sku: 'DRV-A4988-HS-RED',
    category: 'Motors & Drivers',
    subCategory: 'Stepper Drivers',
    price: 68,
    originalPrice: 95,
    hsn: '85423900',
    gstRate: 18,
    stock: 920,
    rating: 4.6,
    reviewsCount: 88,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7MbAg2aOt9c0PIZXaIsM3lNoLNg02Fal2iUQLOKcDbCYjSEHZeCumhEDNKc9O-sqGoTufreP8tdWy7ThPeD8-hh6Zq2W1ds4D8gliDklvzGnIAjG5fnSU5T8YcnomeFRUcAYvuQhoNY6HGYQmWSu0KJTzAwM0I-DZlSxSaMNGEr4z4o7Spltz_GU8oH3QviWT8Ov9VnfIJaVUU2oBgbQJa1hMEGvBA3vwHyC-vDkhHzGt-eorAkCd',
    description: 'Complete microstepping motor driver with built-in translator for easy operation. Designed to operate bipolar stepper motors in full-, half-, quarter-, eighth-, and sixteenth-step modes with adjustable current limiting.',
    features: [
      'Simple step and direction control interface',
      'Five microstep resolutions: full-step down to 1/16-step',
      'Adjustable trimpot current control with thermal shutdown',
      'Includes self-adhesive blue aluminum heatsink'
    ],
    brand: 'Pololu Compatible',
    voltage: '8V - 35V',
    specifications: {
      'Motor Supply Voltage': '8V - 35V DC',
      'Logic Voltage': '3.0V - 5.5V DC',
      'Output Current': 'Up to 2A per coil with cooling (1A continuous)',
      'Dimensions': '15.5 mm x 20.5 mm'
    },
    packageIncludes: [
      '1 x A4988 Stepper Driver Carrier Module',
      '1 x Blue Aluminum Heatsink with 3M Thermal Tape'
    ],
    badge: 'Hot Deal'
  },
  {
    id: 'hc-sr04-ultrasonic-sensor',
    name: 'HC-SR04 Precision Ultrasonic Distance Sensor Module (2cm - 400cm)',
    sku: 'SEN-HCSR04-US-MOD',
    category: 'Sensors & Modules',
    subCategory: 'Range & Distance Sensors',
    price: 48,
    originalPrice: 75,
    hsn: '90318000',
    gstRate: 18,
    stock: 640,
    rating: 4.7,
    reviewsCount: 94,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8Bco-GJy5xmzGD-2iQZBB_bYzhCLMXqxw6IVPvhvsBM8zTBC5zC6GEdTRv7nA7i7jUQEU3v-a3gIedLlBrHgQuHcYV9RRo5zRlL3N0VF01wzoOaQ02MyCWFqNJVxVAdDX4R6vl95okcPQZK-qoLyUrgifsT1oMyEoXphC0TdLL0YI1gdLC-rS5QF_7aNFfo9wvOdb3y8Kqiy_Tg0lSwgQ77pmwUJ88WD7RYwQDTWClYvTyoDf6A1x',
    description: 'Standard ultrasonic ranging module providing 2cm - 400cm non-contact measurement function with ranging accuracy reaching up to 3mm. Module includes ultrasonic transmitter, receiver, and control circuit.',
    features: [
      'Stable 40 kHz ultrasonic ping frequency',
      'Detection range: 2cm to 400cm (0.8" to 157")',
      'High accuracy resolution down to 0.3cm',
      'Compatible with Arduino, Raspberry Pi, ESP32, and PIC'
    ],
    brand: 'ElecFreaks Compatible',
    voltage: '5V',
    specifications: {
      'Operating Voltage': '5V DC',
      'Operating Current': '15 mA',
      'Effective Angle': '< 15°',
      'Trigger Input Signal': '10µs TTL pulse'
    },
    packageIncludes: [
      '1 x HC-SR04 Ultrasonic Distance Sensor Module'
    ]
  },
  {
    id: 'sg90-micro-servo',
    name: 'TowerPro SG90 9g Micro Servo Motor 180 Degree with Accessory Horns',
    sku: 'MOT-SG90-9G-SRV',
    category: 'Motors & Drivers',
    subCategory: 'Servo Motors',
    price: 89,
    originalPrice: 120,
    hsn: '85011019',
    gstRate: 18,
    stock: 450,
    rating: 4.6,
    reviewsCount: 65,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo7afDqjx2LxDyqnmEQX0fRpsAaAXUONlsq8xg4nZK5kU2ydc9OrFb8iQ8cDRCoaBk1rVn4fJWrgi7VQPwDmi8q7NibX0WLPSmBm1ULidpdEi4e6WRf5iA7RIAxG36lQwxFGclcLoITSdRBQErMtJmUJVfgpbaFbNY_2TUPFrP8Rf89mWfc5zNAebCWa7gP1U34SYwmYOLmltR_M3sJf6NR09VtEpqRNuChunlvOjX3Gulu9qcd-rj',
    description: 'Lightweight, high-quality and lightning-fast 9g servo motor with high torque. Ideal for aeromodelling, RC planes, quadcopters, and robotic pans/tilts.',
    features: [
      'Weight of only 9 grams with high-durability nylon gears',
      '180-degree rotation angle with standard 50Hz PWM control',
      'Includes 3 servo horns and mounting screws'
    ],
    brand: 'TowerPro',
    voltage: '4.8V - 6V',
    specifications: {
      'Stall Torque': '1.8 kg.cm @ 4.8V',
      'Operating Speed': '0.10 sec/60 degrees @ 4.8V',
      'Operating Voltage': '4.8V ~ 6.0V DC',
      'Wire Length': '25 cm JR connector'
    },
    packageIncludes: [
      '1 x SG90 9g Micro Servo Motor',
      '3 x Servo Horn Arms',
      '3 x Mounting Screws'
    ]
  },
  {
    id: 'lipo-3s-2200mah',
    name: 'Orange 3S 11.1V 2200mAh 40C Lithium Polymer (LiPo) Battery Pack',
    sku: 'BAT-3S-2200-40C',
    category: 'Batteries & Chargers',
    subCategory: 'LiPo Batteries',
    price: 1240,
    originalPrice: 1490,
    hsn: '85076000',
    gstRate: 18,
    stock: 84,
    rating: 4.8,
    reviewsCount: 52,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf0XjfJbrhdjhg0VbpvLiPKoO99LBFE6uCTP-_KxA7_79w9ZX4bIG2qSK7tzk__a0aXVJYpAy9tla2Ov7NtXgdJVfDe641HkNv20Vvl5U3VkekKeIXRhJKzeftuu1jHEFuFjSWMxrMEBWzVzGVoCz4wX3uPe1r-dzg6i67KrUgOrEVxwrMvACitKF89MRhhIwBWIJ4E0fbLYP1i6X3_HT1VPgLXDdlyk74i4dPl3qv3QR65L3F_qFq',
    description: 'High-discharge Lithium Polymer battery pack designed for multirotor drones, RC fixed-wing planes, and robotics platforms. Features genuine XT60 connector and JST-XH balance lead.',
    features: [
      'Genuine 40C continuous and 80C burst discharge rate',
      'Heavy-duty 12AWG silicone insulated main discharge wires',
      'Pre-soldered authentic Amass XT60 connector',
      'Reinforced shrink sleeve with cell voltage protection sheet'
    ],
    brand: 'Orange Power',
    voltage: '11.1V',
    specifications: {
      'Configuration': '3S1P (3 Cells in Series)',
      'Nominal Voltage': '11.1V (12.6V fully charged)',
      'Capacity': '2200 mAh (24.42 Wh)',
      'Max Charge Rate': '2C (4.4A)',
      'Weight': '195 grams',
      'Dimensions': '105 x 34 x 24 mm'
    },
    packageIncludes: [
      '1 x Orange 3S 11.1V 2200mAh 40C LiPo Battery Pack with XT60'
    ],
    badge: 'Certified'
  },
  {
    id: 'tb6600-stepper-driver',
    name: 'TB6600 Upgraded 4A 9-42V Microstepping Stepper Motor Driver CNC',
    sku: 'DRV-TB6600-4A-IND',
    category: 'Motors & Drivers',
    subCategory: 'Stepper Drivers',
    price: 495,
    originalPrice: 620,
    hsn: '85423900',
    gstRate: 18,
    stock: 165,
    rating: 4.8,
    reviewsCount: 47,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRmBPdtL0H_ze2YP5iYsYMiUUgpuTgqfDUM0BwCcuMN6rEc72KdSmjsQbz9-FIdCMnnKdxIc2kdrmQn6laakvWbp_-tS5sdsCB8c0RkLxLt00Xu0dCp3_V1NlW4KeQx-_jg9OPDZ9chfX9xmAdqkeaS8AUesEFqcbgDEkX4BfKpjB9jmG3BvrDi9_pvrAbmKWPAgfY2aL3kWKFQHcSbdGiEF7bGwqUWaxIOwexboCHFEc0N15bD49f',
    description: 'Industrial-grade TB6600 single-axis bipolar stepper driver suitable for driving NEMA 17, 23, and 24 two-phase stepper motors. Built-in high-speed optocoupler isolation prevents signal interference.',
    features: [
      'Selectable 6 microstep modes up to 32 segments',
      'Adjustable phase current from 0.5A to 4.0A via DIP switches',
      'Over-temperature, over-current, and under-voltage protection',
      'Heavy-duty cast aluminum heatsink enclosure'
    ],
    brand: 'MakerBase',
    voltage: '9V - 42V',
    specifications: {
      'Input Voltage': '9V - 42V DC',
      'Output Current': '0.5A - 4.0A',
      'Microstep Segments': '1, 2/A, 2/B, 4, 8, 16, 32',
      'Cooling': 'Integrated extruded aluminum heatsink'
    },
    packageIncludes: [
      '1 x TB6600 4A Stepper Motor Driver Controller'
    ]
  },
  {
    id: 'arduino-uno-r3',
    name: 'Arduino Uno R3 Compatible Development Board (CH340G with USB Cable)',
    sku: 'DEV-ARD-UNO-R3',
    category: 'Development Boards',
    subCategory: 'AVR & Microcontrollers',
    price: 320,
    originalPrice: 420,
    hsn: '85423100',
    gstRate: 18,
    stock: 310,
    rating: 4.7,
    reviewsCount: 110,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1ca24-sSVDMcQ0hDEXcMloGCMOyCEK1gXNBNlYOF_JknIwQmJPmdtA62t69lSyZHzbDq-jmA-zhHkBMiZHLFu_Pv5KRx9fOhgccKWnN9l6skbRGdq3CqM-v443F5Sp_AUvRDlFtANm5IxcVk2iW5lOHWx75rO9mLKNNwz8d6HS_4gDN32uxqDJpef4Si1ZSC4V3T3hwzrZnxCPLrZiRnJydn7Dj8jVK4V_w1e0IAGfErx_27fIWx6',
    description: 'Standard Arduino Uno R3 clone board based on the ATmega328P microcontroller with CH340G USB interface. Ideal for STEM education, DIY maker projects, and sensor interfacing.',
    features: [
      '14 Digital I/O pins (6 PWM outputs) and 6 Analog inputs',
      '16 MHz ceramic resonator and onboard reset button',
      'DC power jack (7V-12V input) and USB type B interface',
      'Includes 50cm USB cable'
    ],
    brand: 'Spaceborn Maker Series',
    voltage: '5V',
    specifications: {
      'Microcontroller': 'ATmega328P',
      'Operating Voltage': '5V DC',
      'Recommended Input Voltage': '7V - 12V DC',
      'Flash Memory': '32 KB (0.5 KB used by bootloader)',
      'SRAM': '2 KB, EEPROM: 1 KB'
    },
    packageIncludes: [
      '1 x Arduino Uno R3 Compatible Board',
      '1 x Blue High-Speed USB Cable (50cm)'
    ]
  },
  {
    id: 'smart-car-4wd-kit',
    name: '4WD Autonomous Smart Car Robot Chassis Kit with Encoder Speed Discs',
    sku: 'KIT-4WD-SMARTCAR-PRO',
    category: 'DIY Kits',
    subCategory: 'Robotics Kits',
    price: 1290,
    originalPrice: 1650,
    hsn: '95030090',
    gstRate: 18,
    stock: 62,
    rating: 4.9,
    reviewsCount: 44,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1EBOVKTN9lBo3XxDGF9LL-lAbNx9WLj6Hnyg54Qe7blIxW5zRMJa40q-wYdtTLpv5YdgTPFyrrigKZbBrCAv88hjkialyND-0QaGLybbGTrTNeQrg6z_SwVSQcuim_JrZNXUkn1hiXkWQAXyWDT-In1iRCqwaWzOxW152jAxYUWXisJXNTYBuWhN77DP4j9PUHO9Qcw2Hwodh8DYrwTxKFyOpCCFEeKoEOst9aTuJ5Z_jy4CY-yQ8',
    description: 'Complete 4-wheel drive mobile robotics platform chassis with 4 TT gear motors, speed encoder slotted discs, dual acrylic baseplates, battery box, and toggle switch. Perfect foundation for line-following, obstacle avoidance, and ROS navigation.',
    features: [
      'Dual-layer laser-cut acrylic chassis with pre-drilled sensor mounts',
      '4 x High-torque yellow TT DC gear motors with silicone rubber wheels',
      '4 x 20-slot optical encoder discs for tachometer feedback',
      'Includes 4x AA battery holder and mechanical fast-mount hardware'
    ],
    brand: 'Apex Robotics',
    voltage: '6V',
    specifications: {
      'Drive Type': '4-Wheel Differential Drive',
      'Motors': '4 x 1:48 Ratio Dual Shaft TT Motors',
      'Wheel Diameter': '65 mm, Width: 26 mm',
      'Chassis Dimensions': '255 mm x 150 mm'
    },
    packageIncludes: [
      '2 x Transparent Acrylic Car Platform Plates',
      '4 x TT DC Gear Motors',
      '4 x High-Grip Rubber Tires (65mm)',
      '4 x 20-Grid Speed Encoder Discs',
      '1 x 4xAA Battery Case',
      '1 x Complete Fastener & Standoff Kit'
    ],
    badge: 'Pro Choice'
  },
  {
    id: 'sensor-starter-suite-37in1',
    name: '37-in-1 Sensor Modules Ultimate Learning Suite in Compartment Box',
    sku: 'KIT-SENS-37IN1-BOX',
    category: 'DIY Kits',
    subCategory: 'Sensor Kits',
    price: 1150,
    originalPrice: 1450,
    hsn: '90318000',
    gstRate: 18,
    stock: 95,
    rating: 4.9,
    reviewsCount: 78,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJ7zGMqFmIhNGKM1m5f3wD0Q4BlXSaKeHDBZrzVzhLO7rbmodr2w56Wk5FyMiFEViICZtIzWdtA7nmanXvvesjm-cZwRtOiCyXcXM21KffMcKedf3Ysu3NIrRTFEaPcxSoihTEez3iGbACheR98YSVBPDoNzXau7_e7X8If5P5n1Rq_yDV6XvK3g-DS5rYXMjfcpAASULT0QhKX_7hzMryox9VW4XDL4Vd_0gZ1-Au2047I6320Vxw',
    description: 'Comprehensive 37 sensor module kit designed for Arduino, Raspberry Pi, and STM32 developers. Contains infrared obstacle sensors, rotary encoders, flame sensors, temperature, ultrasonic, buzzer, relay, Hall sensor, and more.',
    features: [
      '37 individual pre-tested sensors and actuators',
      'Organized in a sturdy dual-latch multi-compartment polypropylene box',
      'Includes reference guide chart with pin definitions',
      'Fully compatible with standard 2.54mm breadboard pitch'
    ],
    brand: 'Spaceborn Maker Series',
    specifications: {
      'Module Count': '37 Sensors & Actuators',
      'Compatible Voltage': '3.3V & 5V Logic',
      'Storage Case': 'Dual-layer PP latch container',
      'Weight': '380g'
    },
    packageIncludes: [
      '37 x Sensor and Interface Modules',
      '1 x Clear Compartment Organizer Case',
      '1 x Quick Reference Guide Card'
    ],
    badge: 'Best Seller'
  },
  {
    id: 'digital-soldering-station-60w',
    name: 'Pro-Grade 60W Digital Temperature-Controlled ESD-Safe Soldering Station',
    sku: 'TLS-SOLD-60W-ESD',
    category: 'Tools & Soldering',
    subCategory: 'Soldering Equipment',
    price: 2450,
    originalPrice: 2990,
    hsn: '85151100',
    gstRate: 18,
    stock: 35,
    rating: 4.8,
    reviewsCount: 63,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjvAbxTfrfAnhAjitKctJvG9aEKKyIcVkNLu07HeoPo3SXzzTKbkg3eAIg6QVDKzyJtEjw9ufjS-qr2bXghqchZUnOrxXGtHSGM_Do_s7WGWcwYwoe-3MarB6Ts2DLbLIuPh90oXSUMUo-vfIRI3zNkI7fiVWC1t_nwmcZKk2ETQmYdl-EdPCc4pg-n9X4WPn78i1wiVtLUOehQzbvozCEkc5tckQYut8fBmDdIP5CDL53nhHezC0q',
    description: 'Industrial-grade 60W ESD-safe soldering station with PID microcomputer temperature control. Quick heating ceramic heating core reaches 350°C in under 15 seconds.',
    features: [
      'Microprocessor PID temperature control (200°C - 480°C / 392°F - 896°F)',
      'High-contrast digital LED screen showing set and actual temperatures',
      'ESD-safe design protects sensitive ICs and microcontroller boards',
      'Detachable soldering iron with silicone heat-resistant grip'
    ],
    brand: 'Spaceborn Pro',
    voltage: '220V AC',
    specifications: {
      'Power Rating': '60W',
      'Temperature Range': '200°C ~ 480°C',
      'Temperature Stability': '±1°C (Static)',
      'Tip-to-Ground Resistance': '< 2 Ohms',
      'Heating Core': 'A1321 Ceramic Element'
    },
    packageIncludes: [
      '1 x 60W Digital Soldering Base Unit',
      '1 x Ergonomic Soldering Iron with 900M-T Tip',
      '1 x Cast Iron Iron Holder with Brass Wire Cleaner & Sponge',
      '1 x User Manual'
    ]
  },
  // Additional catalog motors matching catalog page
  {
    id: 'ga12-n20-6v-100rpm',
    name: 'GA12-N20 6V 100RPM Micro Metal Gear Motor High Torque',
    sku: 'MOT-N20-6V-100',
    category: 'Motors & Drivers',
    subCategory: 'Micro Metal Gear Motors',
    price: 210,
    originalPrice: 280,
    hsn: '85011019',
    gstRate: 18,
    stock: 230,
    rating: 4.7,
    reviewsCount: 31,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBc1gZM5MkAPlJ6lKzLqPkUCI8kPItS8aW5Ef0V4OEjub5z8x0INKhdLv5N6fsT7dARL_AK179s7KfpIhqaYW52mVlUHlB29cgclBAtlCMxd4yuAULqMn9lVco2W0FxRX8BOBE9D1RL60xQqtzo5vyR7EV15Pe9bxJxJjJZ16NPlte6_QXBLI4PFNXYR3Va8NiNNQ23heF7UJwfh3xCfb2q6IPXSx0-ACIohucWmsI57E37LrQWT5kX',
    description: 'High-quality 6V miniature metal gear motor with 100 RPM output speed. Rugged all-metal gearbox ensures longevity in combat robotics and robotic locks.',
    features: ['6V DC operation', '100 RPM output', '1.2 kg.cm stall torque', '3mm D-shaft'],
    brand: 'Pololu Compatible',
    voltage: '6V',
    rpm: 100,
    shaftType: '3mm D-Shaft',
    encoder: false,
    specifications: {
      'Rated Voltage': '6V DC',
      'No-load Speed': '100 RPM',
      'Stall Torque': '1.2 kg.cm',
      'Weight': '10g'
    },
    packageIncludes: ['1 x GA12-N20 6V 100RPM Micro Gear Motor']
  },
  {
    id: 'jgb37-520-12v-330rpm',
    name: 'JGB37-520 12V 330RPM High Torque DC Geared Motor with Optical Encoder',
    sku: 'MOT-JGB37-12V-330E',
    category: 'Motors & Drivers',
    subCategory: 'DC Motors & Geared Motors',
    price: 840,
    originalPrice: 990,
    hsn: '85011019',
    gstRate: 18,
    stock: 75,
    rating: 4.9,
    reviewsCount: 22,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpH3nYM1uToJW_JH-QI6_M7bwCoFVNTCIjFgeA-N3RLNHo4Uje1wDsydI5ojByobYKEoBevZpBFYsKR0eJ3jPFATOs2sQKZA2_mWyyUHMFNdQCdxN0kdJzGK7h6r0-Gmul9Mr-PDIWlZbsZDG90-2ac6MSS9Mm4_51iE69ybyIstqTBVMRx9lYGhNc1xmEvCTUu_AtxIFNQUT4BZFpf4p7AoLHQjnv5i9dWpS0Z4EB67AMt5vCtfnb',
    description: 'Industrial 37mm diameter heavy-duty geared motor delivering 5.5 kg.cm torque with built-in dual channel encoder. Ideal for heavy AGVs and service robots.',
    features: ['12V DC operation', '330 RPM output', '6mm D-shaft with keyway', 'Quadrature Hall encoder'],
    brand: 'Chihai Motor',
    voltage: '12V',
    rpm: 330,
    shaftType: '6mm D-Shaft',
    encoder: true,
    specifications: {
      'Rated Voltage': '12V DC',
      'Rated Speed': '330 RPM',
      'Stall Torque': '5.5 kg.cm',
      'Shaft Diameter': '6mm D-shaft'
    },
    packageIncludes: ['1 x JGB37-520 Motor with Cable']
  },
  {
    id: 'motor-775-highspeed',
    name: '775 Ball Bearing High Speed 12V-24V DC Motor 12000 RPM for Drills & CNC',
    sku: 'MOT-775-12V-12K',
    category: 'Motors & Drivers',
    subCategory: 'DC Motors & Geared Motors',
    price: 340,
    originalPrice: 420,
    hsn: '85011019',
    gstRate: 18,
    stock: 190,
    rating: 4.8,
    reviewsCount: 89,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6Ce71ENU9j9TE8uhzncTpBWOYDjunPp6Rg4yMI7iGai_jHJEFtjRuk_GTmClbEx-HHARNoedUcTgR0QbOXpfMF4mbsZRNqfERGBPQDbyGeV-GcGtHY2IUQ3N8Zn_d3X93K6hXOoNVrsuxOalhxX6EZmVuTys-R6bG2E3OB08dYSI2PtuV8QTQcMLRdm19gC8JKOJ1sDTe23YUaQL3SK5xEwszbO3WDw7Y2X21SFEMcbv03SoxRTAc',
    description: 'High power 775 motor with front dual ball bearings and built-in cooling fan. Delivers massive starting torque for mini table saws, PCB drills, and lawn mowers.',
    features: ['12V - 24V DC operating range', '12,000 RPM at 24V', 'Double ball bearings', 'Integrated cooling fan'],
    brand: 'Spaceborn Pro Series',
    voltage: '24V',
    rpm: 12000,
    shaftType: '5mm Round Shaft',
    encoder: false,
    specifications: {
      'Voltage': '12V - 24V DC',
      'Speed': '12,000 RPM @ 24V',
      'Shaft': '5mm Diameter, 16mm Length',
      'Current': 'Stall 10A+'
    },
    packageIncludes: ['1 x 775 High Speed DC Motor']
  },
  {
    id: 'l298n-dual-hbridge',
    name: 'L298N Dual H-Bridge Motor Driver Module with 5V Regulated Output',
    sku: 'DRV-L298N-DUAL-H',
    category: 'Motors & Drivers',
    subCategory: 'DC Motor Drivers',
    price: 135,
    originalPrice: 180,
    hsn: '85423900',
    gstRate: 18,
    stock: 420,
    rating: 4.7,
    reviewsCount: 165,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUQdLPPNUUqoW6K8F9ALeurpL1jr4Kxw5Z-l24M7iY4H9l34I0DX9ZGJOS4ALflaAiIla_jalsB81I0Gk3bRXz6fjL0IEFTQY53qPob92EKnCLHYczOnG8ACXLqOFHlEoxnQw9-2maGr45TL4rU1ny0wBN4k_ce2H12mnuTCZsv3vDOkEmarBwgg5GsQmw2-snuCQOo3Wv9rbtrktJbcXbTIwsDahfvZ4Aus4fz5pewUNSxypCj7Cr',
    description: 'Classic dual full-bridge driver chip designed to accept standard TTL logic levels and drive inductive loads such as relays, solenoids, DC and stepping motors.',
    features: ['Drives two DC motors or one stepper motor', 'Peak current up to 2A per bridge', '5V logic regulator on-board', 'Large aluminum heatsink'],
    brand: 'STMicroelectronics Based',
    voltage: '5V - 35V',
    specifications: {
      'Driver Chip': 'L298N Dual H-Bridge',
      'Motor Supply Voltage': '5V - 35V DC',
      'Peak Output Current': '2A per channel'
    },
    packageIncludes: ['1 x L298N Dual Motor Driver Module']
  },
  {
    id: 'n20-rubber-wheel-30mm',
    name: '30mm High Traction Silicone Rubber Wheel for N20 Motors (Pair)',
    sku: 'MEC-WHL-N20-30MM',
    category: 'Robotics & Mechanical',
    subCategory: 'Wheels & Tracks',
    price: 85,
    originalPrice: 110,
    hsn: '95030090',
    gstRate: 18,
    stock: 310,
    rating: 4.8,
    reviewsCount: 39,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaJNsmXpBWhZoJxAGar-eL2Y0Od7MSjXyY5ZXKYCcEYA5k3A7zGziKDq4etekl8nfVtUU1YA6Du795fy3MpZkB_zPxXOV6EXCVa1BWy2MM6hhyNC_KCNbT3GYzm_z4ckeRQrhQ4HGz39X2Phq_-c9kebwl-nicM6FGrMddghVSQw2mH5bL20aAVAUsLjIZer9PEgyd-sepAckbttCXV9-XmesY2midLmYog3i5kyniUk5dIp6Z8rc7',
    description: 'Precision molded 30mm diameter wheel with high-friction silicone rubber tire. Press-fits onto standard 3mm D-shafts of N20 gear motors.',
    features: ['High traction silicone tread', '3mm D-bore hub', '30mm diameter, 10mm width'],
    brand: 'Spaceborn Mechanics',
    specifications: {
      'Diameter': '30mm',
      'Tread Width': '10mm',
      'Bore': '3mm D-Cut'
    },
    packageIncludes: ['2 x 30mm Rubber Wheels']
  },
  {
    id: 'n20-mounting-bracket-steel',
    name: 'N20 Micro Metal Gear Motor Stamped Steel Mounting Bracket Kit (Pair)',
    sku: 'MEC-BRK-N20-STL',
    category: 'Robotics & Mechanical',
    subCategory: 'Mounting Brackets',
    price: 45,
    originalPrice: 65,
    hsn: '73269099',
    gstRate: 18,
    stock: 440,
    rating: 4.9,
    reviewsCount: 56,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABVWRn2ggqdF_7GYjNCyKB7ZDDatCtspOB4f4YCz357yh7jhXP8bWc_0i1PuHnoj4wtBdqzDMIUQ_Aezv4w6Oag1i2F50Bue4bIvwTUihifPhrb37q9ka7NDkGGafTx-QvKJAh4fftvCF59LgYjEexIq1s48ADiPc9xRY1BHiE_9JfchKALDPJ2OD3s_jjG81Wc0kWeKZUI1Uten12-Y7Q1gRY43EhOMI1rM0UPiHWDDKnEra6RXGf',
    description: 'Rigid stamped steel mounting brackets with black electrophoresis finish, specifically engineered for N20 motors. Includes M1.6 and M2 fasteners.',
    features: ['Sturdy stamped steel construction', 'Pre-tapped mounting holes', 'Includes screw set'],
    brand: 'Spaceborn Mechanics',
    specifications: {
      'Material': 'Cold Rolled Carbon Steel',
      'Finish': 'Black Electrophoresis',
      'Thickness': '1.2mm'
    },
    packageIncludes: ['2 x Steel Brackets', '4 x M1.6 Motor Screws', '4 x M2 Chassis Screws']
  },
  {
    id: 'breadboard-mb102',
    name: 'MB-102 830 Tie Points Solderless Breadboard with Power Rails',
    sku: 'CMP-BRD-MB102-830',
    category: 'Components',
    subCategory: 'Breadboards & Wiring',
    price: 110,
    originalPrice: 150,
    hsn: '85366990',
    gstRate: 18,
    stock: 510,
    rating: 4.8,
    reviewsCount: 77,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANSSL66Vs36nEIVGOWr6oVYwvz7aptIzzozUqM8whqiS4AyxnY3-mcKe1Yx6v7Omlh5B8H6enAqMig373kFw8iV66ON_selvZjiejMj5uHWQ5AvwcyHp4ZtAngiK5AhyzJtmKQ7S9EU7QP-xzD-trM45ewS7VfVerKlBD8vSSvJXcGUCLuoyBpzTBiNyAS2-dzllESL8TxvhhXz9Bn_ICk-F2Wh7uO7oQbyuOLcFX6ozf3_-MvISB1',
    description: 'Standard 830-point solderless prototyping breadboard with colored power distribution rails and peelable self-adhesive foam backing.',
    features: ['830 tie points (630 terminal + 200 power distribution)', 'Standard 2.54mm pitch', 'Interlocking tabs for expanding multiple boards'],
    brand: 'Spaceborn Maker',
    specifications: {
      'Tie Points': '830 Points',
      'Pitch': '2.54 mm (0.1 inch)',
      'Dimensions': '165 x 55 x 10 mm'
    },
    packageIncludes: ['1 x MB-102 830-Point Breadboard']
  },
  {
    id: 'jumper-wires-65pcs',
    name: '65 Pcs Flexible Male-to-Male Solderless Breadboard Jumper Wires Kit',
    sku: 'CMP-WIR-65PCS-MM',
    category: 'Components',
    subCategory: 'Breadboards & Wiring',
    price: 90,
    originalPrice: 125,
    hsn: '85444299',
    gstRate: 18,
    stock: 670,
    rating: 4.7,
    reviewsCount: 61,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWiaqc6bIswO3xQjeteWYd6moSYk0Lvm1GhxDquTmmVgRqoOoJ1GQTeen8wAhu2LbioOk1F_1b7gaS417d0Aexgw5T5Ouu3GALOXd5NNCA57c1TKi3l4fs8hHQNaufUH1Hsp4I1HNkLp3lIjlE21lyV1oH4TqO9TL1ZquPB6Gj8XsVIaqAPwIRDlq7Kzf7pYrW5AVnd1HDS4R9Hy1biXwbx8kAegX4IgXWCfCwlRFl-PVdJNxjJCxk',
    description: 'Assorted set of 65 flexible male-to-male jumper wires in 4 convenient lengths (120mm, 150mm, 200mm, 250mm) with molded connector ends.',
    features: ['Copper-clad aluminum high conductivity cores', 'Assorted bright colors for circuit tracing', 'Reinforced molded header tips'],
    brand: 'Spaceborn Maker',
    specifications: {
      'Quantity': '65 Pieces',
      'Lengths': '4 Assorted lengths',
      'Gauge': '24 AWG'
    },
    packageIncludes: ['65 x Male-to-Male Jumper Wires']
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', count: 1840 },
  { id: 'motors-drivers', name: 'Motors & Drivers', count: 420 },
  { id: 'dev-boards', name: 'Development Boards', count: 315 },
  { id: 'sensors-modules', name: 'Sensors & Modules', count: 380 },
  { id: 'batteries-chargers', name: 'Batteries & Chargers', count: 190 },
  { id: 'diy-kits', name: 'DIY Kits', count: 145 },
  { id: '3d-printing', name: '3D Printing & CNC', count: 185 },
  { id: 'robotics-mechanical', name: 'Robotics & Mechanical', count: 260 },
  { id: 'components', name: 'Components & Hardware', count: 450 },
  { id: 'tools-soldering', name: 'Tools & Soldering', count: 120 }
];

export const MOTOR_SUBCATEGORIES = [
  'Micro Metal N20',
  'Planetary Gear Motors',
  'Coreless & Drone',
  'Johnson Geared Motors',
  'Stepper Motors',
  'Servo Motors',
  'High Speed DC Motors'
];

export const INITIAL_ORDERS: import('../types').Order[] = [
  {
    id: 'spbn-892411',
    orderNumber: 'SPBN-892411',
    date: '2026-09-17 14:22 IST',
    status: 'destination_hub',
    currentStageIndex: 3, // 0: placed, 1: qc, 2: dispatched, 3: hub, 4: out for delivery
    courier: {
      provider: 'BlueDart Apex Express',
      awb: 'BD-8829-4100-IN',
      trackingUrl: 'https://bluedart.com/track/BD-8829-4100-IN',
      estimatedDelivery: 'Tomorrow, 11:30 AM',
      currentLocation: 'Bengaluru Industrial Logistics Hub (Outer Ring Road)'
    },
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Vikram Joshi',
      companyName: 'Apex Robotics Labs LLP',
      email: 'vikram.j@apexrobotics.io',
      phone: '+91 98450 82194',
      addressLine1: 'Plot 42, Electronic City Phase 1',
      addressLine2: 'Hardware Incubation Tech Park, Block C-3',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      isDefault: true,
      type: 'business'
    },
    gstDetails: {
      enabled: true,
      gstin: '29AABCA9482Q1Z7',
      legalName: 'Apex Robotics Labs LLP',
      pan: 'AABCA9482Q',
      stateCode: '29',
      verified: true
    },
    items: [
      {
        productId: 'n20-12v-300rpm-encoder',
        name: 'N20 12V 300RPM Micro Metal Gear Motor with Magnetic Hall Encoder',
        sku: 'MOT-N20-12V-300E',
        hsn: '85011019',
        quantity: 12,
        unitPrice: 342,
        taxableAmount: 4104,
        gstAmount: 738.72,
        total: 4842.72,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0jHiFhzcyrFgJgyr2JGnA-MA0qfoSEqiw2nll3M7zYpo4FfhZMOt0LZqLOiJkRjls09xH8rCqZf29RPN8lTZcnrVuy9e-9pNt_q9vf35L5QPlEZBAK5V6H9wnrMa9HCfeDqh6-x6FsXLtVNLOEmn2IRKFdszN8Movn0r2N87BFmGQzISC2K7uU0qHvqJtFQr54SrVgv2BvpG4HaxLKt-zbiCeoq3tScb1zhEA15I3CSVvtmADPTfd'
      },
      {
        productId: 'tb6600-stepper-driver',
        name: 'TB6600 Upgraded 4A 9-42V Microstepping Stepper Motor Driver CNC',
        sku: 'DRV-TB6600-4A-IND',
        hsn: '85423900',
        quantity: 4,
        unitPrice: 495,
        taxableAmount: 1980,
        gstAmount: 356.40,
        total: 2336.40,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRmBPdtL0H_ze2YP5iYsYMiUUgpuTgqfDUM0BwCcuMN6rEc72KdSmjsQbz9-FIdCMnnKdxIc2kdrmQn6laakvWbp_-tS5sdsCB8c0RkLxLt00Xu0dCp3_V1NlW4KeQx-_jg9OPDZ9chfX9xmAdqkeaS8AUesEFqcbgDEkX4BfKpjB9jmG3BvrDi9_pvrAbmKWPAgfY2aL3kWKFQHcSbdGiEF7bGwqUWaxIOwexboCHFEc0N15bD49f'
      },
      {
        productId: 'esp32-wroom-32d',
        name: 'ESP32-WROOM-32D Dual-Core Wi-Fi & Bluetooth MCU Module (PCB Antenna)',
        sku: 'MCU-ESP32-32D-MOD',
        hsn: '85423100',
        quantity: 10,
        unitPrice: 172,
        taxableAmount: 1720,
        gstAmount: 309.60,
        total: 2029.60,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnMVjJT1-pt_AUMIcro80-s0aL2aPVMCoDou9qgbwJANIBVazQ1s39mu2vq1BLesHXaAFSkkpALE_XVjtV3y7azHza4PJbe25tANLFpKG6RPVKvXpoQ_qya7IRJBaN2UcX9MS9fdjvLIdfp1rIlUtIsMMiIjI8RtrobB9REuUC-iURkIpotv160m7Satr4zsxsEt0Inn5LEXj8WMRXDP7zFsw-WcZJ9_KnlsHly_uVy_3HVRHTksl8'
      }
    ],
    payment: {
      method: 'Stripe Corporate Card',
      paymentIntentId: 'pi_3P7eK2B57XyZa9L010zM19Qr',
      transactionId: 'txn_98231049281',
      status: 'succeeded',
      amount: 9208.72,
      currency: 'inr',
      cardLast4: '4242',
      cardBrand: 'visa'
    },
    pricing: {
      subtotalTaxable: 7804,
      igst: 1404.72,
      cgst: 0,
      sgst: 0,
      discount: 0,
      shipping: 0,
      grandTotal: 9208.72
    },
    telemetryLogs: [
      {
        timestamp: 'Sep 17, 14:22 IST',
        status: 'Order Verified & Payment Cleared',
        location: 'Stripe Gateway Gateway / Spaceborn Central Gateway, Pune',
        notes: 'Institutional GST tax invoice #INV-26-8924 generated and linked.',
        completed: true
      },
      {
        timestamp: 'Sep 17, 16:45 IST',
        status: 'Quality Inspection & Bench Test',
        location: 'Spaceborn Fulfillment Center QC Lab, Chakan Industrial Area',
        notes: '12x N20 motors encoder waveform test and TB6600 driver current calibration passed 100%.',
        completed: true
      },
      {
        timestamp: 'Sep 17, 20:10 IST',
        status: 'Dispatched via Air Express',
        location: 'Pune Airport Cargo Terminal (PNQ)',
        notes: 'Air Cargo flight 6E-892 sorted. Transferred to BlueDart Apex Courier under AWB BD-8829-4100-IN.',
        completed: true
      },
      {
        timestamp: 'Today, 06:15 IST',
        status: 'Arrived at Destination Sort Hub',
        location: 'Bengaluru Industrial Logistics Hub, Bommasandra',
        notes: 'Consignment container deconsolidated. Assigned to Route B-14 delivery van.',
        completed: true
      },
      {
        timestamp: 'Expected Today, 11:30 AM',
        status: 'Out for Priority Delivery',
        location: 'Electronic City Delivery Substation',
        notes: 'Pre-delivery OTP will be dispatched to +91 98450 82194 upon vehicle dispatch.',
        completed: false
      }
    ]
  },
  {
    id: 'spbn-889104',
    orderNumber: 'SPBN-889104',
    date: '2026-09-02 11:05 IST',
    status: 'delivered',
    currentStageIndex: 4,
    courier: {
      provider: 'Delhivery Surface Pro',
      awb: 'DEL-9921-0029-IN',
      trackingUrl: 'https://delhivery.com/track/DEL-9921-0029-IN',
      estimatedDelivery: 'Sep 05, 2026',
      currentLocation: 'Delivered at Reception'
    },
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Vikram Joshi',
      companyName: 'Apex Robotics Labs LLP',
      email: 'vikram.j@apexrobotics.io',
      phone: '+91 98450 82194',
      addressLine1: 'Plot 42, Electronic City Phase 1',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
      type: 'business'
    },
    items: [
      {
        productId: 'digital-soldering-station-60w',
        name: 'Pro-Grade 60W Digital Temperature-Controlled ESD-Safe Soldering Station',
        sku: 'TLS-SOLD-60W-ESD',
        hsn: '85151100',
        quantity: 2,
        unitPrice: 2450,
        taxableAmount: 4900,
        gstAmount: 882,
        total: 5782,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjvAbxTfrfAnhAjitKctJvG9aEKKyIcVkNLu07HeoPo3SXzzTKbkg3eAIg6QVDKzyJtEjw9ufjS-qr2bXghqchZUnOrxXGtHSGM_Do_s7WGWcwYwoe-3MarB6Ts2DLbLIuPh90oXSUMUo-vfIRI3zNkI7fiVWC1t_nwmcZKk2ETQmYdl-EdPCc4pg-n9X4WPn78i1wiVtLUOehQzbvozCEkc5tckQYut8fBmDdIP5CDL53nhHezC0q'
      }
    ],
    payment: {
      method: 'Stripe UPI / Card',
      paymentIntentId: 'pi_3P500AA22xX',
      transactionId: 'txn_10294819',
      status: 'succeeded',
      amount: 5782,
      currency: 'inr'
    },
    pricing: {
      subtotalTaxable: 4900,
      igst: 882,
      cgst: 0,
      sgst: 0,
      discount: 0,
      shipping: 0,
      grandTotal: 5782
    },
    telemetryLogs: [
      {
        timestamp: 'Sep 05, 15:40 IST',
        status: 'Delivered',
        location: 'Apex Robotics Labs Gate 1',
        notes: 'Handed over to security desk / verified via OTP.',
        completed: true
      }
    ]
  }
];

export const PRODUCTS: Product[] = INITIAL_PRODUCTS;
export const MOCK_PRODUCTS: Product[] = INITIAL_PRODUCTS;
