import { CyclePhase, DayLog } from '../types';

export interface CapyTip {
  id: string;
  category:
    | 'menstrual'
    | 'follicular'
    | 'ovulation'
    | 'luteal'
    | 'general'
    | 'high_pain'
    | 'low_energy'
    | 'challenging_mood'
    | 'streak'
    | 'inactive';
  text: string;
  avatarVariant: 'cozy' | 'happy' | 'water' | 'sleepy' | 'sparkle' | 'love';
  tag?: string;
}

// 1. Menstrual Phase (อย่างน้อย 15 ข้อความ)
export const MENSTRUAL_TIPS: CapyTip[] = [
  {
    id: 'm1',
    category: 'menstrual',
    text: 'วันนี้ค่อย ๆ ไปก็ได้นะ ไม่ต้องรีบเลย 🐹💗 คาปิขออยู่ส่งกำลังใจให้ตรงนี้',
    avatarVariant: 'love',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm2',
    category: 'menstrual',
    text: 'น้องคาปิแวะมาเตือนว่า อย่าลืมหาเวลาพักให้ตัวเองนะ การนอนหลับช่วยฟื้นฟูร่างกายได้ดีมากเลย 🌙',
    avatarVariant: 'cozy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm3',
    category: 'menstrual',
    text: 'ถ้าวันนี้รู้สึกไม่ค่อยมีแรง ไม่เป็นไรเลยนะ ร่างกายกำลังทำงานหนักเพื่อดูแลตัวเองอยู่ 🌷',
    avatarVariant: 'cozy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm4',
    category: 'menstrual',
    text: 'พักสักหน่อย แล้วค่อยไปต่อก็ได้ การหยุดพักไม่ใช่ความขี้เกียจ แต่คือการดูแลตัวเองนะ ✨',
    avatarVariant: 'water',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm5',
    category: 'menstrual',
    text: 'วันนี้ไม่ต้องเก่งตลอดเวลาก็ได้นะ! มีอะไรที่ปล่อยวางได้ ลองปล่อยวางดูสักวันนะ 💗🐹',
    avatarVariant: 'happy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm6',
    category: 'menstrual',
    text: 'ดื่มน้ำอุ่นหรือจิบชาคาโมมายล์อุ่น ๆ สักแก้ว จะช่วยให้กล้ามเนื้อรู้สึกผ่อนคลายขึ้นนะ 🍵',
    avatarVariant: 'water',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm7',
    category: 'menstrual',
    text: 'ถ้าปวดเกร็งหน้าท้อง ลองประคบอุ่นเบา ๆ แล้วนอนขดตัวสบาย ๆ ดูนะ คาปิส่งความอบอุ่นให้ 🍊',
    avatarVariant: 'cozy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm8',
    category: 'menstrual',
    text: 'ใส่เสื้อผ้าตัวโปรดที่หลวมสบาย ไม่รัดเอว จะช่วยให้หายใจได้โล่งและสบายตัวขึ้นเยอะเลย ☁️',
    avatarVariant: 'cozy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm9',
    category: 'menstrual',
    text: 'รับฟังเสียงของร่างกายตัวเองในวันนี้ ถ้าอยากพักก็คือร่างกายต้องการพักผ่อนจริง ๆ นะ 🐹💤',
    avatarVariant: 'sleepy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm10',
    category: 'menstrual',
    text: 'คาปิอยากบอกว่า เธอเก่งมากแล้วนะที่ผ่านแต่ละช่วงเวลามาได้ ใจดีกับตัวเองเยอะ ๆ นะ 💕',
    avatarVariant: 'love',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm11',
    category: 'menstrual',
    text: 'การยืดเหยียดเบา ๆ หรือท่าเด็กหมอบ (Child\'s Pose) ช่วยคลายความตึงที่หลังส่วนล่างได้ดีนะ 🧘‍♀️',
    avatarVariant: 'cozy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm12',
    category: 'menstrual',
    text: 'ขนมของหวานนิดหน่อย หรืออาหารที่ชอบ อาจช่วยให้อารมณ์วันนี้ละมุนขึ้นได้นะ 🍫✨',
    avatarVariant: 'happy',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm13',
    category: 'menstrual',
    text: 'น้องคาปิขอนั่งข้าง ๆ เป็นกำลังใจให้เงียบ ๆ นะ ไม่ว่าวันนี้จะเป็นวันที่เหนื่อยแค่ไหน 🐹🌸',
    avatarVariant: 'love',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm14',
    category: 'menstrual',
    text: 'อย่าลืมเปลี่ยนผ้าอนามัยสม่ำเสมอ เพื่อความสะอาดและสบายตัวตลอดวันนะ 💧',
    avatarVariant: 'water',
    tag: 'Menstrual Phase',
  },
  {
    id: 'm15',
    category: 'menstrual',
    text: 'วันนี้ให้รางวัลตัวเองด้วยการทำอะไรที่สบายใจ ไม่ต้องกดดันตัวเองเลยนะคนเก่ง 🌷✨',
    avatarVariant: 'sparkle',
    tag: 'Menstrual Phase',
  },
];

// 2. Follicular Phase (อย่างน้อย 15 ข้อความ)
export const FOLLICULAR_TIPS: CapyTip[] = [
  {
    id: 'f1',
    category: 'follicular',
    text: 'คาปิรู้สึกว่าวันนี้มีพลังขึ้นนะ ✨ แต่ค่อย ๆ ใช้พลังของตัวเองไปตามจังหวะสบาย ๆ ก็ได้!',
    avatarVariant: 'happy',
    tag: 'Follicular Phase',
  },
  {
    id: 'f2',
    category: 'follicular',
    text: 'ช่วงนี้เหมาะกับการเริ่มแพลนสิ่งใหม่ ๆ หรือทำกิจกรรมสนุก ๆ ที่อยากลองทำมานานเลยนะ 🎨',
    avatarVariant: 'sparkle',
    tag: 'Follicular Phase',
  },
  {
    id: 'f3',
    category: 'follicular',
    text: 'อรุณสวัสดิ์วันสดใส! ร่างกายกำลังฟื้นฟูพลังงานกลับมาแล้ว พร้อมลุยแบบมีความสุขนะ 🐹✨',
    avatarVariant: 'happy',
    tag: 'Follicular Phase',
  },
  {
    id: 'f4',
    category: 'follicular',
    text: 'วันนี้ชวนกลับมาทำสิ่งที่ชอบ เช่น ฟังเพลงโปรด เดินเล่นรับลม หรือทำงานอดิเรกกันเถอะ 🎶',
    avatarVariant: 'happy',
    tag: 'Follicular Phase',
  },
  {
    id: 'f5',
    category: 'follicular',
    text: 'ระดับพลังงานเริ่มขยับขึ้นแล้ว! ลองสังเกตความรู้สึกสดชื่นของร่างกายในวันนี้ดูนะ 🌿',
    avatarVariant: 'sparkle',
    tag: 'Follicular Phase',
  },
  {
    id: 'f6',
    category: 'follicular',
    text: 'ช่วงนี้สมองมักจะปลอดโปร่งและคิดไอเดียใหม่ ๆ ได้ลื่นไหล ลองจดบันทึกความคิดดี ๆ ไว้นะ 💡',
    avatarVariant: 'sparkle',
    tag: 'Follicular Phase',
  },
  {
    id: 'f7',
    category: 'follicular',
    text: 'ออกไปรับแสงแดดยามเช้าเบา ๆ สัก 10 นาที จะช่วยเติมความสดชื่นให้น้องคาปิและเธอได้ดีมาก ☀️',
    avatarVariant: 'water',
    tag: 'Follicular Phase',
  },
  {
    id: 'f8',
    category: 'follicular',
    text: 'ทานอาหารที่มีสีสันสดใส ผักผลไม้กรอบ ๆ จะช่วยให้ร่างกายรู้สึกกระปรี้กระเปร่ายิ่งขึ้น 🥗🍎',
    avatarVariant: 'happy',
    tag: 'Follicular Phase',
  },
  {
    id: 'f9',
    category: 'follicular',
    text: 'ลองขยับร่างกายอย่างการเดินเร็วหรือโยคะเบา ๆ จะรู้สึกโล่งสบายตัวขึ้นอีกระดับเลย 🚶‍♀️',
    avatarVariant: 'sparkle',
    tag: 'Follicular Phase',
  },
  {
    id: 'f10',
    category: 'follicular',
    text: 'วันนี้ยิ้มให้ตัวเองในกระจกหรือยังนะ? คาปิขอยิ้มส่งความสดใสให้เธอก่อนหนึ่งที! 🐹😄',
    avatarVariant: 'happy',
    tag: 'Follicular Phase',
  },
  {
    id: 'f11',
    category: 'follicular',
    text: 'พลังแห่งความกระตือรือร้นกำลังเริ่มทำงาน ค่อย ๆ ทำทีละเป้าหมายเล็ก ๆ นะ ทำได้แน่นอน 🎯',
    avatarVariant: 'sparkle',
    tag: 'Follicular Phase',
  },
  {
    id: 'f12',
    category: 'follicular',
    text: 'ดื่มน้ำให้เพียงพอระหว่างวันนะ ร่างกายที่ชุ่มชื้นจะช่วยให้ผิวพรรณสดใสขึ้นด้วย 💧✨',
    avatarVariant: 'water',
    tag: 'Follicular Phase',
  },
  {
    id: 'f13',
    category: 'follicular',
    text: 'ช่วงนี้การเรียนรู้ทักษะใหม่ ๆ หรืออ่านหนังสือเล่มที่ดองไว้จะรู้สึกสนุกเป็นพิเศษเลย 📚',
    avatarVariant: 'happy',
    tag: 'Follicular Phase',
  },
  {
    id: 'f14',
    category: 'follicular',
    text: 'อย่าลืมแวะมาอัปเดตอารมณ์และระดับพลังงานใน Capy Tracking ด้วยนะ คาปิรออ่านอยู่ 📝🐹',
    avatarVariant: 'love',
    tag: 'Follicular Phase',
  },
  {
    id: 'f15',
    category: 'follicular',
    text: 'วันนี้เป็นอีกวันที่เปล่งประกายได้ในแบบของตัวเอง มีความสุขกับทุกช่วงเวลานะคะ 🌟',
    avatarVariant: 'sparkle',
    tag: 'Follicular Phase',
  },
];

// 3. Ovulation Phase (อย่างน้อย 15 ข้อความ)
export const OVULATION_TIPS: CapyTip[] = [
  {
    id: 'o1',
    category: 'ovulation',
    text: 'วันนี้คาปิขอส่งดาวพลังงานให้หนึ่งดวง ⭐🐹 ขอให้เป็นวันที่มั่นใจและมีรอยยิ้มนะ!',
    avatarVariant: 'sparkle',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o2',
    category: 'ovulation',
    text: 'ช่วงนี้คาดว่าอาจเป็นช่วงที่มีพลังงานสูงและมีชีวิตชีวา เปล่งประกายให้เต็มที่เลยนะ ✨',
    avatarVariant: 'happy',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o3',
    category: 'ovulation',
    text: 'การสื่อสารและพบปะเพื่อนฝูงในช่วงนี้มักจะราบรื่น ชวนคนที่รักไปทานของอร่อยกันมั้ย 🍲🐹',
    avatarVariant: 'happy',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o4',
    category: 'ovulation',
    text: 'ช่วงตกไข่เป็นการคาดการณ์โดยประมาณของระบบนะ ความรู้สึกของร่างกายเธอคือข้อมูลที่จริงที่สุด 🌸',
    avatarVariant: 'cozy',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o5',
    category: 'ovulation',
    text: 'ถ้าช่วงนี้รู้สึกมีแรงขับเคลื่อนเยอะ ลองลงมือทำโปรเจกต์ที่ตั้งใจไว้ได้เลยนะ ลุยเลย! 🚀',
    avatarVariant: 'sparkle',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o6',
    category: 'ovulation',
    text: 'บางคนอาจรู้สึกคัดตึงหน้าอกหรือเจ็บแปลบเบา ๆ ช่วงนี้ได้ ถือเป็นสัญญาณธรรมชาติของร่างกายนะ 🌷',
    avatarVariant: 'cozy',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o7',
    category: 'ovulation',
    text: 'ความสดใสวันนี้ขอให้ส่องสว่างไปถึงทุกคนรอบข้างเลยนะ คาปิภูมิใจในตัวเธอเสมอ 💖',
    avatarVariant: 'love',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o8',
    category: 'ovulation',
    text: 'พกขวดน้ำติดตัวไว้จิบระหว่างวัน เพื่อให้ร่างกายคงความสดชื่นตลอดทั้งบ่ายนะ 💧',
    avatarVariant: 'water',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o9',
    category: 'ovulation',
    text: 'ความมั่นใจคือเครื่องประดับที่น่ารักที่สุด วันนี้ไม่ว่าทำอะไรก็ขอให้เชื่อมั่นในตัวเองนะ ✨',
    avatarVariant: 'sparkle',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o10',
    category: 'ovulation',
    text: 'ถ้ามีโอกาส ออกกำลังกายแบบคาร์ดิโอหรือเต้นตามเพลงโปรด จะช่วยเผาผลาญพลังงานได้สนุกมาก 💃',
    avatarVariant: 'happy',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o11',
    category: 'ovulation',
    text: 'ระบบคำนวณวันตกไข่เป็นการประมาณตามสถิตินะ สังเกตการเปลี่ยนแปลงของร่างกายควบคู่ไปด้วยเสมอ 📋',
    avatarVariant: 'cozy',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o12',
    category: 'ovulation',
    text: 'คาปิตุ๋นส้มยูซุรอไว้แล้ว! แวะมาพักผ่อนคลายกล้ามเนื้อหลังใช้พลังงานเต็มที่ด้วยนะ 🍊🛁',
    avatarVariant: 'water',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o13',
    category: 'ovulation',
    text: 'วันนี้เป็นวันที่ดีที่จะบอกความรู้สึกดี ๆ กับคนรอบข้าง ความน่ารักของเธอส่งต่อไปถึงทุกคนได้นะ 💕',
    avatarVariant: 'love',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o14',
    category: 'ovulation',
    text: 'พลังงานดี ๆ มีอยู่เต็มเปี่ยม แต่อย่าลืมทานอาหารให้ตรงเวลาด้วยนะ คาปิเป็นห่วง 🍙',
    avatarVariant: 'happy',
    tag: 'Ovulation Phase',
  },
  {
    id: 'o15',
    category: 'ovulation',
    text: 'ส่งพลังบวกให้หนึ่งฟอดใหญ่! 🐹⭐ วันนี้ขอให้เจอแต่เรื่องราวดี ๆ และรอยยิ้มนะ',
    avatarVariant: 'sparkle',
    tag: 'Ovulation Phase',
  },
];

// 4. Luteal Phase (อย่างน้อย 15 ข้อความ)
export const LUTEAL_TIPS: CapyTip[] = [
  {
    id: 'l1',
    category: 'luteal',
    text: 'ถ้าวันนี้อยากพักมากขึ้น ก็ให้เวลาตัวเองได้พักนะ 🌙 ไม่ต้องรู้สึกผิดเลยสักนิด',
    avatarVariant: 'cozy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l2',
    category: 'luteal',
    text: 'คาปิขอเสนอภารกิจวันนี้: พักผ่อน + ดื่มน้ำอุ่น + ใจดีกับตัวเองเยอะ ๆ 💗🐹',
    avatarVariant: 'love',
    tag: 'Luteal Phase',
  },
  {
    id: 'l3',
    category: 'luteal',
    text: 'ช่วงก่อนมีประจำเดือน ฮอร์โมนอาจทำให้รู้สึกอ่อนไหวง่าย เป็นเรื่องปกติมาก ๆ เลยนะ 🥺🌷',
    avatarVariant: 'cozy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l4',
    category: 'luteal',
    text: 'ถ้าจู่ ๆ รู้สึกอยากร้องไห้หรือหงุดหงิด ให้กอดตัวเองแน่น ๆ นะ คาปิพร้อมอยู่ข้าง ๆ เสมอ 🫂',
    avatarVariant: 'love',
    tag: 'Luteal Phase',
  },
  {
    id: 'l5',
    category: 'luteal',
    text: 'ลดคาเฟอีนหรือน้ำหวานจัดลงสักนิด แล้วเปลี่ยนเป็นชาสมุนไพรอุ่น ๆ อาจช่วยให้อารมณ์สงบขึ้นนะ 🍵',
    avatarVariant: 'water',
    tag: 'Luteal Phase',
  },
  {
    id: 'l6',
    category: 'luteal',
    text: 'เตรียมแผ่นประคบอุ่นหรือกางเกงที่ใส่สบายไว้ใกล้ตัวล่วงหน้านะ เตรียมพร้อมไว้จะอุ่นใจกว่า 🧦',
    avatarVariant: 'cozy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l7',
    category: 'luteal',
    text: 'ร่างกายอาจเริ่มสะสมน้ำและรู้สึกอึดอัดตัวเล็กน้อย ไม่ต้องกังวลเลยนะ เดี๋ยวช่วงนี้ก็จะผ่านไป 💧',
    avatarVariant: 'water',
    tag: 'Luteal Phase',
  },
  {
    id: 'l8',
    category: 'luteal',
    text: 'ถ้ามีงานใหญ่ที่เลื่อนได้ ลองจัดตารางให้เบาลงหน่อยนะ เซฟพลังงานไว้ให้ตัวเองก่อน 🛋️',
    avatarVariant: 'cozy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l9',
    category: 'luteal',
    text: 'การเขียนไดอารี่หรือระบายความรู้สึกลงในช่องบันทึก ช่วยคลายความอึดอัดในใจได้ดีมากเลยนะ 📖',
    avatarVariant: 'happy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l10',
    category: 'luteal',
    text: 'นอนหลับให้เร็วขึ้นสัก 30 นาที คืนนี้ให้รางวัลตัวเองด้วยการพักผ่อนอย่างเต็มอิ่มนะ 😴💤',
    avatarVariant: 'sleepy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l11',
    category: 'luteal',
    text: 'ถ้าอยากกินของอร่อยที่ชอบ ทานได้เลยนะในปริมาณพอเหมาะ ความสุขเล็ก ๆ มีค่าต่อใจเสมอ 🍪',
    avatarVariant: 'happy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l12',
    category: 'luteal',
    text: 'หลีกเลี่ยงการตัดสินใจเรื่องสำคัญหรือกดดันตัวเองในช่วงนี้นะ ค่อย ๆ คิดเมื่อใจพร้อม 🕊️',
    avatarVariant: 'cozy',
    tag: 'Luteal Phase',
  },
  {
    id: 'l13',
    category: 'luteal',
    text: 'แม้อารมณ์จะขึ้นลงเหมือนคลื่นทะเล คาปิก็จะเป็นโขดหินที่นั่งอยู่ข้าง ๆ ไม่หนีไปไหนนะ 🐹🌊',
    avatarVariant: 'love',
    tag: 'Luteal Phase',
  },
  {
    id: 'l14',
    category: 'luteal',
    text: 'สูดหายใจเข้าลึก ๆ ช้า ๆ 4 วินาที แล้วค่อย ๆ ผ่อนลมหายใจออก ทำแบบนี้สัก 3 ครั้งเพื่อผ่อนคลายนะ 🌬️',
    avatarVariant: 'water',
    tag: 'Luteal Phase',
  },
  {
    id: 'l15',
    category: 'luteal',
    text: 'ส่งกอดนุ่มนิ่มแบบคาปิบาร่าให้เธอเลยนะ อดทนอีกนิดนะคนเก่ง ทุกอย่างจะค่อย ๆ สบายขึ้น 💗',
    avatarVariant: 'love',
    tag: 'Luteal Phase',
  },
];

// 5. General Encouragement (อย่างน้อย 20 ข้อความ)
export const GENERAL_TIPS: CapyTip[] = [
  {
    id: 'g1',
    category: 'general',
    text: 'สวัสดีนะ! วันนี้ไม่ว่าจะเจออะไรมา คาปิขอเป็นรอยยิ้มเล็ก ๆ ในวันของเธอนะ 🐹✨',
    avatarVariant: 'happy',
  },
  {
    id: 'g2',
    category: 'general',
    text: 'การดูแลตัวเองเริ่มต้นจากการฟังเสียงของร่างกายในทุก ๆ วันนะ รักตัวเองให้มาก ๆ 💖',
    avatarVariant: 'love',
  },
  {
    id: 'g3',
    category: 'general',
    text: 'แวะมาดื่มน้ำสักแก้วก่อนนะ! น้ำเปล่าสะอาดช่วยให้ร่างกายและสมองสดชื่นขึ้นทันตา 💧',
    avatarVariant: 'water',
  },
  {
    id: 'g4',
    category: 'general',
    text: 'ไม่จำเป็นต้องเพอร์เฟกต์ทุกวัน แค่เป็นตัวเองในแบบที่มีความสุขก็ยอดเยี่ยมที่สุดแล้ว 🌷',
    avatarVariant: 'cozy',
  },
  {
    id: 'g5',
    category: 'general',
    text: 'ถ้าเหนื่อยก็แค่นั่งพักสักครู่ เหมือนคาปิบาร่าที่ชอบนั่งนิ่ง ๆ ริมน้ำอย่างสงบสุข 🍃🐹',
    avatarVariant: 'cozy',
  },
  {
    id: 'g6',
    category: 'general',
    text: 'จำไว้เสมอนะว่า เธอมีคุณค่าและคู่ควรกับความรักและการดูแลเอาใจใส่เสมอ 💕',
    avatarVariant: 'love',
  },
  {
    id: 'g7',
    category: 'general',
    text: 'ขอให้วันนี้มีเรื่องเล็ก ๆ ที่ทำให้เธอยิ้มออก ไม่ว่าจะเป็นกลิ่นกาแฟหอม ๆ หรือลมเย็น ๆ ☕🌸',
    avatarVariant: 'happy',
  },
  {
    id: 'g8',
    category: 'general',
    text: 'พักสายตาจากหน้าจอสัก 1-2 นาที แล้วมองออกไปไกล ๆ ให้ตาได้ผ่อนคลายบ้างนะ 🌿',
    avatarVariant: 'cozy',
  },
  {
    id: 'g9',
    category: 'general',
    text: 'ทุกรอบเดือนคือการทำงานอย่างมหัศจรรย์ของร่างกาย ขอบคุณร่างกายตัวเองบ่อย ๆ นะ 🌸',
    avatarVariant: 'love',
  },
  {
    id: 'g10',
    category: 'general',
    text: 'หายใจเข้าลึก ๆ... ปล่อยวางความเครียดลงช้า ๆ... เธอทำได้ดีมากแล้วในจุดที่ยืนอยู่ ✨',
    avatarVariant: 'water',
  },
  {
    id: 'g11',
    category: 'general',
    text: 'มีใครบอกเธอหรือยังว่า วันนี้เธอดูน่ารักและเก่งมากเลย? คาปิบอกเองนะ! 🐹🥰',
    avatarVariant: 'sparkle',
  },
  {
    id: 'g12',
    category: 'general',
    text: 'คืนนี้ถ้าหัวถึงหมอน อย่าลืมทิ้งเรื่องกวนใจไว้นอกห้อง แล้วหลับฝันดีอย่างสงบสุขนะ 🌙💤',
    avatarVariant: 'sleepy',
  },
  {
    id: 'g13',
    category: 'general',
    text: 'ก้าวเล็ก ๆ ในแต่ละวัน มีความหมายเสมอ ไม่ต้องรีบเปรียบเทียบตัวเองกับใครนะ 🐢✨',
    avatarVariant: 'happy',
  },
  {
    id: 'g14',
    category: 'general',
    text: 'เสียงดนตรีเบา ๆ หรือเสียงฝนตก อาจช่วยให้จิตใจสงบและผ่อนคลายขึ้นได้ในวันนี้นะ 🌧️🎶',
    avatarVariant: 'water',
  },
  {
    id: 'g15',
    category: 'general',
    text: 'น้องคาปิส่งส้มยูซุลูกโตให้หนึ่งผล! 🍊 รับความสดชื่นและวิตามินใจไปเต็ม ๆ เลยนะ',
    avatarVariant: 'happy',
  },
  {
    id: 'g16',
    category: 'general',
    text: 'การรู้จักปฏิเสธในสิ่งที่ไม่ไหว ก็เป็นรูปแบบหนึ่งของการรักตัวเองเหมือนกันนะ 🛡️💗',
    avatarVariant: 'cozy',
  },
  {
    id: 'g17',
    category: 'general',
    text: 'วันนี้ยืดเส้นยืดสาย บิดขี้เกียจสักนิด คลายความเมื่อยล้าที่สะสมมาทั้งวันนะ 🧘‍♀️',
    avatarVariant: 'cozy',
  },
  {
    id: 'g18',
    category: 'general',
    text: 'ไม่ว่าจะสุขหรือเศร้า คาปิจะคอยอยู่เป็นเพื่อนบันทึกเรื่องราวสุขภาพตรงนี้เสมอ 📖🐹',
    avatarVariant: 'love',
  },
  {
    id: 'g19',
    category: 'general',
    text: 'ให้โอกาสตัวเองได้ทำผิดพลาดและเรียนรู้ โลกนี้ใจดีกับเธอได้เมื่อเธอเริ่มใจดีกับตัวเอง 🌈',
    avatarVariant: 'sparkle',
  },
  {
    id: 'g20',
    category: 'general',
    text: 'ส่งหัวใจดวงโตให้ฟูฟ่อง! 💖 ขอให้ช่วงเวลาที่เหลือของวันนี้เต็มไปด้วยความสบายใจนะ',
    avatarVariant: 'love',
  },
];

// 6. Smart Tips: High Pain (อย่างน้อย 10 ข้อความ)
export const HIGH_PAIN_TIPS: CapyTip[] = [
  {
    id: 'hp1',
    category: 'high_pain',
    text: 'วันนี้คาปิสังเกตว่าคะแนนความปวดของเธอค่อนข้างสูงนะ 💗 ลองพักและดูแลตัวเองตามที่รู้สึกเหมาะกับตัวเองก่อนนะ',
    avatarVariant: 'love',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp2',
    category: 'high_pain',
    text: 'ปวดท้องมากใช่มั้ยคนเก่ง? ลองนอนตะแคงกอดหมอนข้าง หรือใช้กระเป๋าน้ำร้อนอุ่น ๆ ช่วยคลายกล้ามเนื้อนะ 🛋️',
    avatarVariant: 'cozy',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp3',
    category: 'high_pain',
    text: 'ถ้าปวดมากจนทำอะไรไม่ไหว วางทุกอย่างลงก่อนได้เลยนะ การพักผ่อนคือสิ่งสำคัญที่สุดในตอนนี้ 🐹💤',
    avatarVariant: 'sleepy',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp4',
    category: 'high_pain',
    text: 'จิบน้ำอุ่นบ่อย ๆ และหลีกเลี่ยงน้ำเย็นจัดหรือของทอดมัน จะช่วยลดการบีบเกร็งของช่องท้องได้นะ 🍵',
    avatarVariant: 'water',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp5',
    category: 'high_pain',
    text: 'การนวดวนเบา ๆ บริเวณหน้าท้องตามเข็มนาฬิกา อาจช่วยให้เลือดลมไหลเวียนดีขึ้นและลดความตึงได้นะ 🌸',
    avatarVariant: 'cozy',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp6',
    category: 'high_pain',
    text: 'ถ้าอาการปวดรุนแรงต่อเนื่องจนรบกวนชีวิตประจำวัน ลองปรึกษาผู้ปกครองหรือแพทย์ผู้เชี่ยวชาญเพื่อความสบายใจนะ 💗',
    avatarVariant: 'love',
    tag: 'คำแนะนำสุขภาพ',
  },
  {
    id: 'hp7',
    category: 'high_pain',
    text: 'สวมใส่กางเกงที่ไม่รัดหน้าท้อง และนอนในท่าที่ผ่อนคลายที่สุดนะ คาปิขออยู่ส่งพลังใจให้ข้างเตียง 🐹🛌',
    avatarVariant: 'cozy',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp8',
    category: 'high_pain',
    text: 'ไม่ต้องฝืนยิ้มหรือทำตัวเข้มแข็งก็ได้นะ วันที่เจ็บปวด อนุญาตให้ตัวเองได้พักอย่างเต็มที่เลย 🌷',
    avatarVariant: 'love',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp9',
    category: 'high_pain',
    text: 'เปิดเพลงบรรเลงสบาย ๆ หรือฟังเสียงธรรมชาติ ช่วยให้สมาธิผ่อนคลายและลดความกังวลจากความปวดได้นะ 🎶',
    avatarVariant: 'water',
    tag: 'ดูแลความปวด',
  },
  {
    id: 'hp10',
    category: 'high_pain',
    text: 'ถ้าสิ่งที่เกิดขึ้นทำให้กังวลหรือไม่สบายใจ ลองคุยกับผู้ปกครอง ผู้ใหญ่ที่ไว้ใจได้ หรือบุคลากรทางการแพทย์นะ 💗',
    avatarVariant: 'love',
    tag: 'คำแนะนำสุขภาพ',
  },
];

// 7. Smart Tips: Low Energy (อย่างน้อย 10 ข้อความ)
export const LOW_ENERGY_TIPS: CapyTip[] = [
  {
    id: 'le1',
    category: 'low_energy',
    text: 'พลังงานวันนี้ดูน้อยลงนิดหน่อย 🐹 วันนี้ไม่ต้องฝืนตัวเองมากก็ได้นะ ชาร์จแบตให้เต็มที่ก่อน',
    avatarVariant: 'sleepy',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le2',
    category: 'low_energy',
    text: 'แบตเตอรี่เหลือน้อยก็ไม่เป็นไร แค่ทำสิ่งจำเป็นทีละอย่าง แล้วหาเวลางีบสัก 15-20 นาทีนะ 🔋💤',
    avatarVariant: 'cozy',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le3',
    category: 'low_energy',
    text: 'วันนี้เป็นโหมดประหยัดพลังงาน ทำงานแบบสโลว์ไลฟ์ตามสไตล์น้องคาปิบาร่ากันเถอะ 🍃🐹',
    avatarVariant: 'happy',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le4',
    category: 'low_energy',
    text: 'ดื่มน้ำให้เพียงพอและทานผลไม้ที่มีวิตามิน เช่น ส้มหรือกล้วย จะช่วยเติมพลังงานธรรมชาติได้อย่างนุ่มนวล 🍌🍊',
    avatarVariant: 'happy',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le5',
    category: 'low_energy',
    text: 'พักสายตาและสูดอากาศบริสุทธิ์สักพัก ร่างกายกำลังขอเวลาฟื้นฟู ชาร์จไฟให้ตัวเองนะ ✨',
    avatarVariant: 'water',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le6',
    category: 'low_energy',
    text: 'ลดการใช้ความคิดหนัก ๆ และเลือกทานอาหารที่ย่อยง่าย จะช่วยให้ร่างกายไม่เหนื่อยเกินไปนะ 🥣',
    avatarVariant: 'cozy',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le7',
    category: 'low_energy',
    text: 'ไม่ต้องวิ่งตามจังหวะของใคร วันนี้เดินช้า ๆ ตามความพร้อมของตัวเราเองก็พอแล้วนะ 🚶‍♀️💖',
    avatarVariant: 'love',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le8',
    category: 'low_energy',
    text: 'คืนนี้เข้านอนให้ไวกว่าเดิมสักนิด ให้ร่างกายได้ซ่อมแซมส่วนที่สึกหรออย่างเต็มที่นะ 🌙🛌',
    avatarVariant: 'sleepy',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le9',
    category: 'low_energy',
    text: 'คาปิส่งถังน้ำอุ่นและการพักผ่อนแบบแช่สบายใจมาให้ รับพลังแห่งความผ่อนคลายไปนะ 🛁✨',
    avatarVariant: 'water',
    tag: 'เติมพลังงาน',
  },
  {
    id: 'le10',
    category: 'low_energy',
    text: 'พรุ่งนี้ค่อยเริ่มใหม่ได้เสมอ วันนี้ให้เป็นวันแห่งการเติมพลังให้ใจและกายนะ 🌷🐹',
    avatarVariant: 'love',
    tag: 'เติมพลังงาน',
  },
];

// 8. Smart Tips: Challenging Mood (อย่างน้อย 10 ข้อความ)
export const CHALLENGING_MOOD_TIPS: CapyTip[] = [
  {
    id: 'cm1',
    category: 'challenging_mood',
    text: 'วันที่อารมณ์ไม่ค่อยดีเกิดขึ้นได้เลยนะ คาปิขออยู่เป็นเพื่อนตรงนี้ ไม่ตัดสินอะไรเลย 💗',
    avatarVariant: 'love',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm2',
    category: 'challenging_mood',
    text: 'ถ้าวันนี้รู้สึกหงุดหงิดหรืออ่อนไหวง่าย มันคือผลของฮอร์โมน ไม่ใช่ว่าเธอไม่น่ารักนะ 🥺🌷',
    avatarVariant: 'cozy',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm3',
    category: 'challenging_mood',
    text: 'กอดแน่น ๆ นะคนเก่ง ถ้าอยากร้องไห้ก็ร้องออกมาได้เลย น้ำตาช่วยชะล้างความอึดอัดได้ดีนะ 🫂💧',
    avatarVariant: 'love',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm4',
    category: 'challenging_mood',
    text: 'ลองถอยออกมาจากสิ่งที่ทำให้หงุดหงิดสักก้าว ไปอยู่ในมุมเงียบ ๆ ที่สบายใจสักครู่นะ 🍃',
    avatarVariant: 'cozy',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm5',
    category: 'challenging_mood',
    text: 'อารมณ์เป็นเหมือนเมฆที่ลอยผ่านเข้ามา แล้วเดี๋ยวฟ้าก็จะค่อย ๆ สดใสขึ้นเองนะ ☁️🌤️',
    avatarVariant: 'happy',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm6',
    category: 'challenging_mood',
    text: 'ฟังเพลงโปรดที่ฟังแล้วสบายใจ หรือกอดตุ๊กตานุ่ม ๆ สักตัว จะช่วยให้อารมณ์อบอุ่นขึ้นนะ 🧸🎶',
    avatarVariant: 'cozy',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm7',
    category: 'challenging_mood',
    text: 'เขียนสิ่งที่คิดอยู่ลงในโน้ต ปลดปล่อยความคิดออกมาบนกระดาษ จะช่วยให้หัวโล่งขึ้นเยอะ 📝✨',
    avatarVariant: 'happy',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm8',
    category: 'challenging_mood',
    text: 'คาปิบาร่ายื่นแก้มกลม ๆ ให้เธอจับเล่นแก้เครียดหนึ่งที นุ่มนิ่มหายเครียดแน่นอน! 🐹🤏',
    avatarVariant: 'happy',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm9',
    category: 'challenging_mood',
    text: 'วันนี้ไม่ต้องใจดีกับทุกคนก็ได้ แต่ขอให้ใจดีกับความรู้สึกของตัวเองเป็นอันดับแรกนะ 💖',
    avatarVariant: 'love',
    tag: 'ดูแลใจ',
  },
  {
    id: 'cm10',
    category: 'challenging_mood',
    text: 'หากรู้สึกกังวลหรือไม่สบายใจมากเกินไป ลองพูดคุยกับเพื่อนสนิท ครอบครัว หรือคนที่ไว้ใจได้ดูนะ 🌸',
    avatarVariant: 'love',
    tag: 'ดูแลใจ',
  },
];

// 9. Smart Tips: Consistent Streak (อย่างน้อย 10 ข้อความ)
export const STREAK_TIPS: CapyTip[] = [
  {
    id: 'st1',
    category: 'streak',
    text: 'ว้าว! เธอบันทึกข้อมูลต่อเนื่องมาหลายวันแล้ว เก่งมากเลย ✨🐹 คาปิชื่นชมในความใส่ใจตัวเองนะ',
    avatarVariant: 'sparkle',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st2',
    category: 'streak',
    text: 'การบันทึกสม่ำเสมอจะช่วยให้ระบบวิเคราะห์รูปแบบรอบเดือนของเธอได้แม่นยำยิ่งขึ้น ยอดเยี่ยมมาก! 📊💖',
    avatarVariant: 'happy',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st3',
    category: 'streak',
    text: 'สถิติการบันทึกของเธอยอดเยี่ยมมาก! น้องคาปิขอปรบมือรัว ๆ ให้เลยนะ 👏🐹✨',
    avatarVariant: 'sparkle',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st4',
    category: 'streak',
    text: 'การกลับมาเช็กสุขภาพตัวเองทุกวัน คือของขวัญที่ดีที่สุดที่เธอมอบให้ตัวเองนะ 🎁🌸',
    avatarVariant: 'love',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st5',
    category: 'streak',
    text: 'ข้อมูลที่บันทึกไว้ทำให้เราเข้าใจร่างกายได้ลึกซึ้งยิ่งขึ้น ขอบคุณที่ดูแลตัวเองอย่างดีนะ 📝✨',
    avatarVariant: 'happy',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st6',
    category: 'streak',
    text: 'คาปิติดเหรียญทองคนเก่งให้หนึ่งเหรียญ! 🥇 ความสม่ำเสมอของเธอน่าประทับใจจริง ๆ',
    avatarVariant: 'sparkle',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st7',
    category: 'streak',
    text: 'เห็นเธอบันทึกข้อมูลต่อเนื่อง คาปิมีพลังมานั่งเฝ้าหน้าจอทุกวันเลย ดีใจที่ได้อยู่ข้าง ๆ นะ 🐹💕',
    avatarVariant: 'love',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st8',
    category: 'streak',
    text: 'ยิ่งบันทึกต่อเนื่อง หน้าย้อนหลังและ Insights ก็ยิ่งแสดงข้อมูลที่มีประโยชน์กับเธอมากเท่านั้น 📈💡',
    avatarVariant: 'happy',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st9',
    category: 'streak',
    text: 'สร้างนิสัยที่ดีในการสังเกตตัวเองสำเร็จไปอีกขั้นแล้วนะ ยินดีด้วยจริง ๆ จ้า 🌟🌱',
    avatarVariant: 'sparkle',
    tag: 'ความสม่ำเสมอ',
  },
  {
    id: 'st10',
    category: 'streak',
    text: 'น้องคาปิกระโดดหมุนตัวดีใจ! 🐹🎉 ขอบคุณที่แวะมาทักทายและบันทึกข้อมูลกันในวันนี้นะคะ',
    avatarVariant: 'happy',
    tag: 'ความสม่ำเสมอ',
  },
];

// 10. Smart Tips: Inactive / Welcome Back (อย่างน้อย 10 ข้อความ)
export const INACTIVE_TIPS: CapyTip[] = [
  {
    id: 'ia1',
    category: 'inactive',
    text: 'หายไปหลายวันไม่เป็นไรเลยนะ! 🐹✨ ยินดีต้อนรับกลับมา กลับมาเมื่อไหร่ก็บันทึกต่อได้เลยเสมอ',
    avatarVariant: 'happy',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia2',
    category: 'inactive',
    text: 'คาปิคิดถึงจังเลย! ดีใจที่ได้เจอกันอีกนะ สบายดีมั้ยคะคนเก่ง? 🌸🐹',
    avatarVariant: 'love',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia3',
    category: 'inactive',
    text: 'ไม่ต้องกังวลเรื่องวันที่ไม่ได้บันทึกเลยนะ แค่วันนี้แวะมาดูแลตัวเองก็ยอดเยี่ยมที่สุดแล้ว 💖',
    avatarVariant: 'cozy',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia4',
    category: 'inactive',
    text: 'ช่วงที่ผ่านมาอาจจะยุ่งหรือมีเรื่องให้ทำเยอะ คาปิเข้าใจดีนะ พักผ่อนและแวะมาอัปเดตเมื่อพร้อมได้เลย 🛋️',
    avatarVariant: 'cozy',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia5',
    category: 'inactive',
    text: 'เปิดแอปเมื่อไหร่ คาปิบาร่าตัวนี้ก็ยังนั่งรอต้อนรับเธอด้วยรอยยิ้มเสมอจ้า 🐹🥰',
    avatarVariant: 'happy',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia6',
    category: 'inactive',
    text: 'แวะมาเช็กสถานะรอบเดือนสักนิด แล้วไปใช้ชีวิตอย่างมีความสุขต่อนะ คาปิเป็นกำลังใจให้ ✨',
    avatarVariant: 'sparkle',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia7',
    category: 'inactive',
    text: 'ไม่มีการหักคะแนน ไม่มีความกดดัน ที่นี่คือพื้นที่ปลอดภัยสำหรับดูแลตัวเองของเธอนะ 🌷',
    avatarVariant: 'love',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia8',
    category: 'inactive',
    text: 'วันนี้เริ่มบันทึกใหม่ได้สบาย ๆ เลย น้องคาปิเตรียมสมุดบันทึกไว้รอแล้วนะ 📝🐹',
    avatarVariant: 'happy',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia9',
    category: 'inactive',
    text: 'ดีใจที่ได้พบกันอีกครั้งนะ ดื่มน้ำสักแก้วแล้วค่อย ๆ บันทึกข้อมูลวันนี้กันนะ 💧✨',
    avatarVariant: 'water',
    tag: 'ยินดีต้อนรับกลับ',
  },
  {
    id: 'ia10',
    category: 'inactive',
    text: 'อบอุ่นใจเสมอเมื่อเธอเปิดแอปกลับมา ขอให้วันนี้เป็นวันที่น่ารักและผ่อนคลายนะ 💕',
    avatarVariant: 'love',
    tag: 'ยินดีต้อนรับกลับ',
  },
];

/**
 * Context-aware Capy message selector:
 * Priority Order:
 * 1. Specific data logged today (Pain >= 6, Energy <= 3, Challenging Moods)
 * 2. Logging habits (3+ day streak or returning after 3+ days)
 * 3. Current Cycle Phase (Menstrual, Follicular, Ovulation, Luteal)
 * 4. General Encouragement
 */
export function getContextualCapyTips(
  phase: CyclePhase,
  todayLog?: DayLog,
  allLogs?: Record<string, DayLog>
): { primaryPool: CapyTip[]; fallbackPool: CapyTip[] } {
  const primaryPool: CapyTip[] = [];
  const fallbackPool: CapyTip[] = [...GENERAL_TIPS];

  // Check today's logged data first
  if (todayLog) {
    // 1. High Pain (Pain >= 6)
    if (typeof todayLog.pain === 'number' && todayLog.pain >= 6) {
      primaryPool.push(...HIGH_PAIN_TIPS);
    }

    // 2. Low Energy (Energy <= 3)
    if (typeof todayLog.energy === 'number' && todayLog.energy <= 3) {
      primaryPool.push(...LOW_ENERGY_TIPS);
    }

    // 3. Challenging Mood
    const challengingMoods = ['sensitive', 'crampy', 'irritable', 'anxious', 'tired', 'sleepy'];
    const hasChallengingMood = (todayLog.moods || []).some((m) =>
      challengingMoods.includes(m)
    );
    if (hasChallengingMood) {
      primaryPool.push(...CHALLENGING_MOOD_TIPS);
    }
  }

  // Check streaks / inactivity
  if (allLogs) {
    const dates = Object.keys(allLogs).sort();
    if (dates.length >= 3) {
      // Check for recent consecutive 3 days
      const last3Dates = dates.slice(-3);
      // If today is recorded and 3 in a row
      if (todayLog && last3Dates.includes(todayLog.date)) {
        primaryPool.push(...STREAK_TIPS);
      }
    }
  }

  // Cycle phase tips
  switch (phase) {
    case 'menstrual':
      primaryPool.push(...MENSTRUAL_TIPS);
      break;
    case 'follicular':
      primaryPool.push(...FOLLICULAR_TIPS);
      break;
    case 'ovulation':
      primaryPool.push(...OVULATION_TIPS);
      break;
    case 'luteal':
      primaryPool.push(...LUTEAL_TIPS);
      break;
  }

  return { primaryPool, fallbackPool };
}

/**
 * Randomly pick a tip from the available pools, ensuring no immediate repetition
 */
export function getRandomCapyTip(
  primaryPool: CapyTip[],
  fallbackPool: CapyTip[],
  lastTipId?: string
): CapyTip {
  const combined = primaryPool.length > 0 ? primaryPool : fallbackPool;
  const filtered = combined.filter((tip) => tip.id !== lastTipId);
  const candidates = filtered.length > 0 ? filtered : combined;

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex] || GENERAL_TIPS[0];
}
