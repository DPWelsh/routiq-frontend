import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

// JSON data structure interfaces
interface TranscriptMessage {
  speaker: 'patient' | 'staff'
  timestamp: string
  text: string
}

interface ConversationData {
  id: string
  phone_number: string
  patient_name: string
  patient_id: string
  date: string
  conversation_type: string
  status: string
  sentiment: string
  priority: string
  transcript: TranscriptMessage[]
}

interface JsonConversationsData {
  conversations: ConversationData[]
}

// Live conversation data from n8n - 20 WhatsApp + 20 Instagram
const LIVE_CONVERSATIONS = [
  // === WHATSAPP CONVERSATIONS (20) ===
  {
    phone: "+6287862502798",
    patient_name: "Griffin (via Uncle)",
    email: "griffin@example.com",
    patient_id: "pat_001", 
    conversation_id: "conv_001",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-07-01T04:04:45Z",
    total_messages: 3,
    last_message_time: "2025-07-01T04:04:45Z",
    last_message_content: "If Griffin wants to book in for an assessment while he's in Ulus, just let me know and I can check our availability for him!",
    last_message_sender: "agent",
    latest_conversation_date: "2025-07-01T04:04:45Z"
  },
  {
    phone: "+447817478312",
    patient_name: "Immy",
    email: "immy@example.com",
    patient_id: "pat_002",
    conversation_id: "conv_002", 
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T19:56:38Z",
    total_messages: 8,
    last_message_time: "2025-06-30T19:56:38Z",
    last_message_content: "So yes, it is worth booking an appointment, it isn't too early to learn how to treat and minimize it",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T19:56:38Z"
  },
  {
    phone: "+13109245014",
    patient_name: "Amanda Strum",
    email: "amanda.strum@example.com",
    patient_id: "pat_003",
    conversation_id: "conv_003",
    conversation_source: "whatsapp", 
    conversation_updated_at: "2025-06-30T16:59:14Z",
    total_messages: 15,
    last_message_time: "2025-06-30T16:59:14Z",
    last_message_content: "Perfect! Your appointment is confirmed 🙌 Today (Tuesday, July 1st) at 4:30pm with Alister at SurfRehab, 360 Move, Uluwatu. Given your worsening wrist/finger pain, this will give Alister a chance to reassess and adjust your treatment plan accordingly.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T16:59:14Z"
  },
  {
    phone: "+380987737958",
    patient_name: "Artem Melnychuk",
    email: "artem441@yahoo.com",
    patient_id: "pat_004",
    conversation_id: "conv_004",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-29T23:38:36Z", 
    total_messages: 15,
    last_message_time: "2025-06-29T23:38:36Z",
    last_message_content: "Perfect! Your appointment is confirmed: Tuesday, July 1st at 6:00pm with Alister at SurfRehab at 360 Move, Uluwatu. We're all set for your knee rehabilitation consultation tomorrow evening.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-29T23:38:36Z"
  },
  {
    phone: "+6281935454615",
    patient_name: "Teresa", 
    email: "teresa@example.com",
    patient_id: "pat_005",
    conversation_id: "conv_005",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T18:15:33Z",
    total_messages: 15,
    last_message_time: "2025-06-30T18:15:33Z", 
    last_message_content: "Actually nomsorry you are still on a package so it is covered in our package",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T18:15:33Z"
  },
  {
    phone: "+628113882556",
    patient_name: "Edd Wright",
    email: "edd.wright@example.com", 
    patient_id: "pat_006",
    conversation_id: "conv_006",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T16:58:57Z",
    total_messages: 13,
    last_message_time: "2025-06-30T16:58:57Z",
    last_message_content: "No worries at all, Edd! Your Thursday 8:30am appointment has been cancelled and Alister has been notified. Just reach out whenever you're ready to reschedule - we'll be here to help! 🙂",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T16:58:57Z"
  },
  {
    phone: "+6281529509431",
    patient_name: "Unknown Indonesian Speaker",
    email: "unknown@example.com",
    patient_id: "pat_007", 
    conversation_id: "conv_007",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T03:10:58Z",
    total_messages: 3,
    last_message_time: "2025-06-30T03:10:58Z",
    last_message_content: "No worries at all! This is SurfRehab physiotherapy reception at 360 Move, Uluwatu. If you ever need physiotherapy services, feel free to reach out 🙂",
    last_message_sender: "agent", 
    latest_conversation_date: "2025-06-30T03:10:58Z"
  },
  {
    phone: "+6281456789012",
    patient_name: "Maya Sari",
    email: "maya.sari@example.com",
    patient_id: "pat_008",
    conversation_id: "conv_008",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T14:22:15Z",
    total_messages: 6,
    last_message_time: "2025-06-30T14:22:15Z",
    last_message_content: "Perfect! Your follow-up appointment is booked for Friday at 11:30am. Your shoulder progress has been excellent - keep up the exercises! 💪",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T14:22:15Z"
  },
  {
    phone: "+61423567890",
    patient_name: "Jake Morrison",
    email: "jake.morrison@example.com",
    patient_id: "pat_009",
    conversation_id: "conv_009",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-30T09:45:22Z",
    total_messages: 12,
    last_message_time: "2025-06-30T09:45:22Z",
    last_message_content: "Absolutely! Alister specializes in ACL rehab. I've forwarded your MRI report and he'll create a tailored program for your return to rugby. Expect his call within 2 hours.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T09:45:22Z"
  },
  {
    phone: "+6285678901234",
    patient_name: "Putu Wijaya",
    email: "putu.wijaya@example.com",
    patient_id: "pat_010",
    conversation_id: "conv_010",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-29T16:33:44Z",
    total_messages: 4,
    last_message_time: "2025-06-29T16:33:44Z",
    last_message_content: "Terima kasih! Yes, we have Indonesian-speaking staff available. Your appointment is confirmed for Monday 2pm with additional translation support.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-29T16:33:44Z"
  },
  {
    phone: "+33612345678",
    patient_name: "Sophie Laurent",
    email: "sophie.laurent@example.com",
    patient_id: "pat_011",
    conversation_id: "conv_011",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-29T11:18:35Z",
    total_messages: 9,
    last_message_time: "2025-06-29T11:18:35Z",
    last_message_content: "Excellent! Your chronic lower back treatment package (6 sessions) is confirmed. We'll start with postural assessment this Thursday at 10am.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-29T11:18:35Z"
  },
  {
    phone: "+491234567890",
    patient_name: "Klaus Weber",
    email: "klaus.weber@example.com",
    patient_id: "pat_012",
    conversation_id: "conv_012",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-28T20:15:22Z",
    total_messages: 5,
    last_message_time: "2025-06-28T20:15:22Z",
    last_message_content: "Understood! Emergency Sunday treatment for your herniated disc - Alister will meet you at the clinic in 30 minutes. Bring your pain medication list.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-28T20:15:22Z"
  },
  {
    phone: "+6281122334455",
    patient_name: "Dewa Putra",
    email: "dewa.putra@example.com",
    patient_id: "pat_013",
    conversation_id: "conv_013",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-28T13:42:18Z",
    total_messages: 7,
    last_message_time: "2025-06-28T13:42:18Z",
    last_message_content: "Great progress! Your hamstring strain is 90% healed. One more session should clear you for competitive surfing again. Friday 4pm work?",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-28T13:42:18Z"
  },
  {
    phone: "+85234567890",
    patient_name: "Li Wei",
    email: "li.wei@example.com",
    patient_id: "pat_014",
    conversation_id: "conv_014",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-27T15:28:41Z",
    total_messages: 11,
    last_message_time: "2025-06-27T15:28:41Z",
    last_message_content: "Your tennis elbow is responding well to dry needling! Let's continue with 2 more sessions this week. Tuesday 9am and Thursday 2pm available.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-27T15:28:41Z"
  },
  {
    phone: "+6287654321098",
    patient_name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    patient_id: "pat_015",
    conversation_id: "conv_015",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-27T08:55:33Z",
    total_messages: 6,
    last_message_time: "2025-06-27T08:55:33Z",
    last_message_content: "Hi Sarah! Reminder: Please bring your X-rays to tomorrow's appointment. Alister wants to review them before starting your spinal manipulation treatment.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-27T08:55:33Z"
  },
  {
    phone: "+61445566778",
    patient_name: "Tom Anderson",
    email: "tom.anderson@example.com",
    patient_id: "pat_016",
    conversation_id: "conv_016",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-26T19:44:26Z",
    total_messages: 8,
    last_message_time: "2025-06-26T19:44:26Z",
    last_message_content: "Excellent question! Yes, we do work with travel insurance. I'll send you the required forms for your claim. Most Australian insurers cover our treatments.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-26T19:44:26Z"
  },
  {
    phone: "+6289876543210",
    patient_name: "Kadek Agus",
    email: "kadek.agus@example.com",
    patient_id: "pat_017",
    conversation_id: "conv_017",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-26T12:33:55Z",
    total_messages: 4,
    last_message_time: "2025-06-26T12:33:55Z",
    last_message_content: "Baik! Your motorcycle accident injuries assessment is scheduled. We'll focus on your neck whiplash and right ankle sprain - comprehensive evaluation this afternoon.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-26T12:33:55Z"
  },
  {
    phone: "+1416555777",
    patient_name: "Emma Thompson",
    email: "emma.thompson@example.com",
    patient_id: "pat_018",
    conversation_id: "conv_018",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-25T16:22:11Z",
    total_messages: 10,
    last_message_time: "2025-06-25T16:22:11Z",
    last_message_content: "Amazing progress! Your pre-natal back pain program is working perfectly. Continue the modified exercises and see you next Tuesday for final trimester adjustments.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-25T16:22:11Z"
  },
  {
    phone: "+6282233445566",
    patient_name: "Made Sari",
    email: "made.sari@example.com",
    patient_id: "pat_019",
    conversation_id: "conv_019",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-25T10:15:44Z",
    total_messages: 5,
    last_message_time: "2025-06-25T10:15:44Z",
    last_message_content: "Perfect timing! Your work-related repetitive strain injury claim has been approved. We can start intensive treatment immediately - 3x weekly for 4 weeks.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-25T10:15:44Z"
  },
  {
    phone: "+27823456789",
    patient_name: "Johan van der Merwe",
    email: "johan.vandermerwe@example.com",
    patient_id: "pat_020",
    conversation_id: "conv_020",
    conversation_source: "whatsapp",
    conversation_updated_at: "2025-06-24T14:38:22Z",
    total_messages: 7,
    last_message_time: "2025-06-24T14:38:22Z",
    last_message_content: "Lekker! Your rotator cuff surgery rehab is ahead of schedule. Dr. Alister says you can start light surfing next week - we'll monitor closely.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-24T14:38:22Z"
  },

  // === INSTAGRAM CONVERSATIONS (20) ===
  {
    phone: "@zoe_surfergirl",
    patient_name: "Zoe Martinez",
    email: "zoe.martinez@example.com",
    patient_id: "pat_021",
    conversation_id: "conv_021",
    conversation_source: "instagram",
    conversation_updated_at: "2025-07-01T12:33:18Z",
    total_messages: 4,
    last_message_time: "2025-07-01T12:33:18Z",
    last_message_content: "Absolutely! We specialize in surf-related injuries 🏄‍♀️ Your rib pain from wiping out sounds like intercostal strain. Can you come in today at 3pm?",
    last_message_sender: "agent",
    latest_conversation_date: "2025-07-01T12:33:18Z"
  },
  {
    phone: "@fitnessjunkie_bali",
    patient_name: "Marcus Reid",
    email: "marcus.reid@example.com",
    patient_id: "pat_022",
    conversation_id: "conv_022",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-30T18:45:22Z",
    total_messages: 6,
    last_message_time: "2025-06-30T18:45:22Z",
    last_message_content: "Your deadlift form analysis was spot on! 💪 The muscle imbalance is causing your lower back issues. Booked you for movement assessment Friday 10am.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T18:45:22Z"
  },
  {
    phone: "@yoga_goddess_ulus",
    patient_name: "Aria Chen",
    email: "aria.chen@example.com",
    patient_id: "pat_023",
    conversation_id: "conv_023",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-30T15:22:44Z",
    total_messages: 8,
    last_message_time: "2025-06-30T15:22:44Z",
    last_message_content: "Yes! We totally understand yoga injuries 🧘‍♀️ Your hip flexor strain from attempting advanced poses is very common. Thursday 2pm appointment confirmed!",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T15:22:44Z"
  },
  {
    phone: "@kite_addict_indo",
    patient_name: "Luca Rossi",
    email: "luca.rossi@example.com",
    patient_id: "pat_024",
    conversation_id: "conv_024",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-30T09:18:35Z",
    total_messages: 5,
    last_message_time: "2025-06-30T09:18:35Z",
    last_message_content: "Gnarly wipeout dude! 🪁 Kite surfing shoulder dislocations need immediate attention. Can you get to our clinic within the hour? Alister's on standby.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-30T09:18:35Z"
  },
  {
    phone: "@backpacker_adventures",
    patient_name: "Chloe Wilson",
    email: "chloe.wilson@example.com",
    patient_id: "pat_025",
    conversation_id: "conv_025",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-29T20:44:11Z",
    total_messages: 7,
    last_message_time: "2025-06-29T20:44:11Z",
    last_message_content: "Travel insurance definitely covers physiotherapy! 🎒 Your heavy backpack has caused thoracic spine issues. We'll sort you out before your next destination.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-29T20:44:11Z"
  },
  {
    phone: "@mma_fighter_bali",
    patient_name: "Danny Kim",
    email: "danny.kim@example.com",
    patient_id: "pat_026",
    conversation_id: "conv_026",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-29T14:55:28Z",
    total_messages: 9,
    last_message_time: "2025-06-29T14:55:28Z",
    last_message_content: "Perfect! Your fight camp injury assessment is booked 🥊 We'll get your shoulder and ribs sorted before your next bout. Sports-specific rehab is our specialty.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-29T14:55:28Z"
  },
  {
    phone: "@bali_digital_nomad",
    patient_name: "Alex Johnson",
    email: "alex.johnson@example.com",
    patient_id: "pat_027",
    conversation_id: "conv_027",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-29T11:33:52Z",
    total_messages: 6,
    last_message_time: "2025-06-29T11:33:52Z",
    last_message_content: "Tech neck is so real! 💻 Your forward head posture from laptop work needs addressing. We'll fix your ergonomics and pain. Monday 9am works?",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-29T11:33:52Z"
  },
  {
    phone: "@dance_instructor_ulus",
    patient_name: "Isabella Santos",
    email: "isabella.santos@example.com",
    patient_id: "pat_028",
    conversation_id: "conv_028",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-28T16:42:33Z",
    total_messages: 11,
    last_message_time: "2025-06-28T16:42:33Z",
    last_message_content: "Your pirouette injury is healing beautifully! 💃 Keep doing the ankle stability exercises. Cleared for full dance classes next week - just avoid grand jetés for now.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-28T16:42:33Z"
  },
  {
    phone: "@rock_climber_indo",
    patient_name: "Ben Clarke",
    email: "ben.clarke@example.com",
    patient_id: "pat_029",
    conversation_id: "conv_029",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-28T08:25:17Z",
    total_messages: 4,
    last_message_time: "2025-06-28T08:25:17Z",
    last_message_content: "Epic send! 🧗‍♂️ But that finger pulley strain needs immediate attention. Climbing hold injuries are our specialty - emergency slot at 11am today?",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-28T08:25:17Z"
  },
  {
    phone: "@wellness_retreat_bali",
    patient_name: "Sophia Anderson",
    email: "sophia.anderson@example.com",
    patient_id: "pat_030",
    conversation_id: "conv_030",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-27T19:18:44Z",
    total_messages: 8,
    last_message_time: "2025-06-27T19:18:44Z",
    last_message_content: "Your wellness retreat injury package is approved! ✨ 3 sessions to address your meditation posture-related neck pain. Holistic approach as requested.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-27T19:18:44Z"
  },
  {
    phone: "@skate_culture_bali",
    patient_name: "Tyler Brooks",
    email: "tyler.brooks@example.com",
    patient_id: "pat_031",
    conversation_id: "conv_031",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-27T13:42:18Z",
    total_messages: 5,
    last_message_time: "2025-06-27T13:42:18Z",
    last_message_content: "Sick trick gone wrong! 🛹 Your ankle fracture rehab starts tomorrow. We'll get you back on the board safely - specialized skateboard injury protocols.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-27T13:42:18Z"
  },
  {
    phone: "@freediver_depths",
    patient_name: "Marina Petrov",
    email: "marina.petrov@example.com",
    patient_id: "pat_032",
    conversation_id: "conv_032",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-26T22:15:33Z",
    total_messages: 7,
    last_message_time: "2025-06-26T22:15:33Z",
    last_message_content: "Freediving spinal compression is serious! 🤿 Your decompression injury needs specialized treatment. Emergency assessment tonight - Alister's coming in.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-26T22:15:33Z"
  },
  {
    phone: "@crossfit_warrior_bali",
    patient_name: "Jordan Smith",
    email: "jordan.smith@example.com",
    patient_id: "pat_033",
    conversation_id: "conv_033",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-26T15:28:44Z",
    total_messages: 6,
    last_message_time: "2025-06-26T15:28:44Z",
    last_message_content: "Beast mode gone wrong! 💪 Your Olympic lift injury (wrist hyperextension) needs immediate assessment. Can you make it here by 4pm today?",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-26T15:28:44Z"
  },
  {
    phone: "@photography_nomad",
    patient_name: "Rachel Kim",
    email: "rachel.kim@example.com",
    patient_id: "pat_034",
    conversation_id: "conv_034",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-25T18:55:22Z",
    total_messages: 4,
    last_message_time: "2025-06-25T18:55:22Z",
    last_message_content: "Photographer's shoulder is totally a thing! 📸 Your heavy camera gear has caused impingement syndrome. Specialized treatment for creatives - Thursday 1pm?",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-25T18:55:22Z"
  },
  {
    phone: "@muay_thai_student",
    patient_name: "Carlos Rodriguez",
    email: "carlos.rodriguez@example.com",
    patient_id: "pat_035",
    conversation_id: "conv_035",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-25T12:44:17Z",
    total_messages: 9,
    last_message_time: "2025-06-25T12:44:17Z",
    last_message_content: "Your shin conditioning injury is healing well! 🥊 Continue the bone conditioning protocol. Cleared for light sparring - we'll monitor your progress.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-25T12:44:17Z"
  },
  {
    phone: "@surf_instructor_life",
    patient_name: "Kai Tanaka",
    email: "kai.tanaka@example.com",
    patient_id: "pat_036",
    conversation_id: "conv_036",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-24T20:33:55Z",
    total_messages: 8,
    last_message_time: "2025-06-24T20:33:55Z",
    last_message_content: "Teaching 8 hours daily is taking its toll! 🏄‍♂️ Your instructor burnout symptoms (chronic back pain) need addressing. Professional surfer package available.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-24T20:33:55Z"
  },
  {
    phone: "@bali_startup_life",
    patient_name: "Nina Patel",
    email: "nina.patel@example.com",
    patient_id: "pat_037",
    conversation_id: "conv_037",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-24T14:22:11Z",
    total_messages: 5,
    last_message_time: "2025-06-24T14:22:11Z",
    last_message_content: "Startup life stress is showing in your muscles! 💼 Your tension headaches and neck pain need immediate attention. Corporate wellness package available.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-24T14:22:11Z"
  },
  {
    phone: "@adventure_couple_bali",
    patient_name: "Sam & Julie Thompson",
    email: "samjulie.thompson@example.com",
    patient_id: "pat_038",
    conversation_id: "conv_038",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-23T16:18:33Z",
    total_messages: 7,
    last_message_time: "2025-06-23T16:18:33Z",
    last_message_content: "Couples package perfect for your matching surf injuries! 💕 Both your shoulder strains can be treated simultaneously. Double appointment Wednesday 2pm?",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-23T16:18:33Z"
  },
  {
    phone: "@meditation_teacher_ulus",
    patient_name: "David Kumar",
    email: "david.kumar@example.com",
    patient_id: "pat_039",
    conversation_id: "conv_039",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-23T09:42:28Z",
    total_messages: 6,
    last_message_time: "2025-06-23T09:42:28Z",
    last_message_content: "Meditation posture injuries are surprisingly common! 🧘‍♂️ Your sacroiliac joint dysfunction from prolonged sitting needs gentle mobilization. Mindful treatment approach.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-23T09:42:28Z"
  },
  {
    phone: "@elite_athlete_training",
    patient_name: "Victoria Chang",
    email: "victoria.chang@example.com",
    patient_id: "pat_040",
    conversation_id: "conv_040",
    conversation_source: "instagram",
    conversation_updated_at: "2025-06-22T21:55:44Z",
    total_messages: 12,
    last_message_time: "2025-06-22T21:55:44Z",
    last_message_content: "Olympic prep going perfectly! 🏅 Your performance optimization program shows 15% improvement in mobility. Final assessment before competition next week.",
    last_message_sender: "agent",
    latest_conversation_date: "2025-06-22T21:55:44Z"
  }
]

// Message interface
interface PhoneMessage {
  id: number
  content: string
  sender_type: 'user' | 'agent' | 'system'
  timestamp: string
  metadata: Record<string, unknown> | null
  external_id: string
}

// Sample messages for each conversation
const CONVERSATION_MESSAGES: Record<string, PhoneMessage[]> = {
  "+6287862502798": [
    {
      id: 1,
      content: "ey brew, got my nephew in town and his shoulder is buggin him. Goina have Griffin hit you up while hes here in ulus",
      sender_type: "user",
      timestamp: "2025-07-01T04:04:42Z",
      metadata: null,
      external_id: "msg_001_1"
    },
    {
      id: 2, 
      content: "G'day! Thanks for reaching out about your nephew's shoulder. I've forwarded your message to our physiotherapist who'll be able to give Griffin proper guidance on his shoulder issue. They'll get back to you soon (we're on Bali time - GMT+8).",
      sender_type: "agent",
      timestamp: "2025-07-01T04:04:43Z",
      metadata: null,
      external_id: "msg_001_2"
    },
    {
      id: 3,
      content: "If Griffin wants to book in for an assessment while he's in Ulus, just let me know and I can check our availability for him!",
      sender_type: "agent", 
      timestamp: "2025-07-01T04:04:45Z",
      metadata: null,
      external_id: "msg_001_3"
    }
  ],
  "+447817478312": [
    {
      id: 1,
      content: "Hey I think I have costochrondritis it came on this morning. Is it worth coming to see you or is it too soon? I had it before didn't rest properly an took me a month to recover 🙈 Currently just resting, ice and ibuprofen. Let me know if I should book an appointment or wait a few days. Thank you 🫶",
      sender_type: "user",
      timestamp: "2025-06-30T19:23:58Z",
      metadata: null,
      external_id: "msg_002_1"
    },
    {
      id: 2,
      content: "Hi there! Thanks for reaching out about your costochondritis concerns. I've forwarded your message straight to our physiotherapist who will be able to give you proper guidance on whether it's best to come in now or wait a few days, especially given your previous experience with it.",
      sender_type: "agent",
      timestamp: "2025-06-30T19:24:02Z", 
      metadata: null,
      external_id: "msg_002_2"
    },
    {
      id: 3,
      content: "When I say came on this morning I mean during a surf session",
      sender_type: "user",
      timestamp: "2025-06-30T19:50:38Z",
      metadata: null,
      external_id: "msg_002_3"
    },
    {
      id: 4,
      content: "Thanks for clarifying that it happened during your surf session this morning! I've made sure to include that important detail when forwarding your message to our physiotherapist. They'll get back to you with expert guidance! 🏄‍♂️",
      sender_type: "agent",
      timestamp: "2025-06-30T19:50:41Z",
      metadata: null,
      external_id: "msg_002_4"
    },
    {
      id: 5,
      content: "Hi immy yes it happens quite often in surfers as you can imagine. Especially on the bottom of the ribs where it contacts the board. But there are some good things you can do and learn to relieve them and we can go through those management strategies so you can keep surfing with irritating it too much",  
      sender_type: "agent",
      timestamp: "2025-06-30T19:56:10Z",
      metadata: null,
      external_id: "msg_002_5"
    },
    {
      id: 6,
      content: "So yes, it is worth booking an appointment, it isn't too early to learn how to treat and minimize it",
      sender_type: "agent",
      timestamp: "2025-06-30T19:56:38Z",
      metadata: null,
      external_id: "msg_002_6"
    }
  ],
  "+13109245014": [
    {
      id: 1,
      content: "Hi, I'm dealing with worsening ulnar wrist/finger pain after a treatment I had yesterday. Can I please get back on the schedule for a gentle evaluation? 🙏🏽",
      sender_type: "user", 
      timestamp: "2025-06-30T15:55:04Z",
      metadata: null,
      external_id: "msg_003_1"
    },
    {
      id: 2,
      content: "Hi Amanda! I'm so sorry to hear your wrist/finger pain has worsened after yesterday's treatment. Let's definitely get you back in for a gentle evaluation with Alister.",
      sender_type: "agent",
      timestamp: "2025-06-30T15:55:08Z",
      metadata: null,
      external_id: "msg_003_2"
    },
    {
      id: 3,
      content: "Thank you! Is there anything tomorrow available?",
      sender_type: "user",
      timestamp: "2025-06-30T16:03:10Z", 
      metadata: null,
      external_id: "msg_003_3"
    },
    {
      id: 4,
      content: "Unfortunately tomorrow (Wednesday, July 2nd) is fully booked! Since your pain has worsened, the earliest we can get you in would be: Today (Tuesday, July 1st): 4:30pm, 6:45pm",
      sender_type: "agent",
      timestamp: "2025-06-30T16:03:15Z",
      metadata: null,
      external_id: "msg_003_4"
    },
    {
      id: 5,
      content: "Can I come at 4:30?",
      sender_type: "user",
      timestamp: "2025-06-30T16:59:10Z",
      metadata: null,
      external_id: "msg_003_5"
    },
    {
      id: 6,
      content: "Perfect! Your appointment is confirmed 🙌 Today (Tuesday, July 1st) at 4:30pm with Alister at SurfRehab, 360 Move, Uluwatu. Given your worsening wrist/finger pain, this will give Alister a chance to reassess and adjust your treatment plan accordingly.",
      sender_type: "agent",
      timestamp: "2025-06-30T16:59:14Z",
      metadata: null,
      external_id: "msg_003_6"
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    // If phone parameter is provided, return individual conversation data
    if (phone) {
      // Read the JSON file with actual conversation data
      const jsonFilePath = path.join(process.cwd(), 'live_conversation_data.json')
      const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
      
      // Find the conversation by phone number
      const conversation = (jsonData as JsonConversationsData).conversations.find((conv: ConversationData) => 
        conv.phone_number === phone
      )
      
      if (!conversation) {
        return NextResponse.json({
          success: false,
          error: 'Conversation not found'
        })
      }
      
      // Convert the JSON format to the expected API format
      const conversationDetail = {
        phone: conversation.phone_number,
        patient_name: conversation.patient_name,
        email: `${conversation.patient_name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        conversation_id: conversation.id,
        conversation_start: conversation.date,
        conversation_last_activity: conversation.date,
        total_messages: conversation.transcript?.length || 0,
        first_message_time: conversation.transcript?.[0]?.timestamp || conversation.date,
        last_message_time: conversation.transcript?.[conversation.transcript.length - 1]?.timestamp || conversation.date
      }
      
      // Convert transcript to messages format
      const messages = conversation.transcript?.map((msg: TranscriptMessage, index: number) => ({
        id: index + 1,
        content: msg.text,
        sender_type: msg.speaker === 'patient' ? 'user' : 'agent',
        timestamp: new Date(conversation.date).toISOString(),
        metadata: {
          original_timestamp: msg.timestamp,
          conversation_type: conversation.conversation_type,
          sentiment: conversation.sentiment,
          priority: conversation.priority
        },
        external_id: `${conversation.id}_msg_${index + 1}`
      })) || []
      
      return NextResponse.json({
        success: true,
        data: {
          conversation: conversationDetail,
          messages: messages
        }
      })
    }
    
    // If no phone parameter, return the list of conversations (existing behavior)
    const conversations = LIVE_CONVERSATIONS.map(conv => ({
      ...conv,
      unread_messages: Math.floor(Math.random() * 3), // Random for demo
      clinical_priority: conv.total_messages > 10 ? 'high' : 'medium',
      last_activity: conv.last_message_time,
      patient_status: 'active',
      conversation_summary: conv.last_message_content.substring(0, 100) + '...'
    }))

    return NextResponse.json({
      success: true,
      data: conversations
    })
  } catch (error) {
    console.error('Phone conversations API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch conversations'
    }, { status: 500 })
  }
} 