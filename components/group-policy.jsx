// group-policy.jsx — Group Policy dars bo'limlari (L40, L41, L42)

// ─────────────────────────────────────────────────────────────
// Lesson 40: Group Policy — Kirish
// ─────────────────────────────────────────────────────────────
function SectionGPIntro() {
  const lang = useLang();
  const t = (uz, en) => lang === "en" ? en : uz;

  return (
    <section>
      <H2 num="§1" uz="Guruh siyosati nima?" en="What are Group Policies?" />
      <P>{t(
        "Shu vaqtgacha biz foydalanuvchilar va kompyuterlarni tashkiliy birliklarda (OU) guruhlagan edik, biroq bundan ko'zlangan asosiy maqsad — har bir OU uchun alohida turlicha siyosatlarni joriy qila olishdir. Shunday qilib, biz foydalanuvchilarning qaysi bo'limga tegishli ekanligidan kelib chiqib, ularga turli xil sozlamalar va xavfsizlik standartlarini yuborishimiz mumkin.",
        "We've been grouping users and computers into OUs, but the main goal is to apply different policies per OU — sending different settings and security standards depending on which department the user belongs to."
      )}</P>
      <P>{t(
        "Windows bu kabi siyosatlarni Guruh Siyosati Obyektlari (GPO) orqali boshqaradi. GPO — bu shunchaki OU'larga qo'llanilishi mumkin bo'lgan sozlamalar to'plamidir. GPO'lar foydalanuvchilarga yoki kompyuterlarga qaratilgan siyosatlarni o'z ichiga olishi mumkin, bu esa sizga muayyan mashinalarda va identifikatorlarda asosiy sozlamalar bazasini o'rnatish imkonini beradi.",
        "Windows manages such policies through Group Policy Objects (GPO). A GPO is simply a collection of settings that can be applied to OUs. GPOs can contain policies targeting users or computers, allowing you to set a baseline of settings across specific machines and identities."
      )}</P>

      <H2 num="§2" uz="GPO Menejment konsoli" en="Group Policy Management Console" />
      <P>{t(
        "GPO'larni sozlash uchun siz 'Start' menyusida mavjud bo'lgan 'Group Policy Management' vositasidan foydalanishingiz mumkin:",
        "To configure GPOs, you use the 'Group Policy Management' tool available from the Start menu:"
      )}</P>
      <img src="assets/gp/gp_s1_p1.png" alt="Group Policy Management Console" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§3" uz="OU ierarxiyasi va GPO bog'lash" en="OU Hierarchy and GPO Linking" />
      <P>{t(
        "Uni ochganingizda birinchi ko'radigan narsangiz, to'liq OU ierarxiyasidir. Guruh siyosatlarini sozlash uchun avval 'Guruh siyosati obyektlari' ostida GPO yaratasiz va keyin uni siyosatlar qo'llanilishini istagan OU'ga bog'laysiz.",
        "When you open it, the first thing you see is the full OU hierarchy. To configure group policies, you first create a GPO under 'Group Policy Objects' and then link it to the OU you want the policies to apply to."
      )}</P>
      <P>{t(
        "Yuqoridagi rasmda 3 ta GPO yaratilganini ko'rishimiz mumkin. Standart domen siyosati va RDP siyosati butun thm.local domeniga bog'langan va standart domen kontrollerlari siyosati faqat domen kontrollerlari OUga bog'langan. Shuni yodda tutish kerakki, har qanday GPO bog'langan OU'ga va uning ostidagi har qanday kichik OU'ga qo'llaniladi.",
        "You can see 3 GPOs created. The Default Domain Policy and RDP Policy are linked to the entire thm.local domain, and the Default Domain Controllers Policy is linked only to the Domain Controllers OU. Keep in mind that any GPO linked to an OU is also applied to any sub-OUs beneath it."
      )}</P>
      <img src="assets/gp/gp_s1_p2.png" alt="OU Hierarchy in GPO Management" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§4" uz="GPO doirasi va xavfsizlik filtri" en="GPO Scope and Security Filtering" />
      <P>{t(
        "GPO ni tanlashda ko'radigan birinchi yorliq uning doirasini ko'rsatadi — bu GPO AD da bog'langan joy. Joriy siyosat uchun biz uning faqat thm.local domeniga bog'langanligini ko'rishimiz mumkin:",
        "When selecting a GPO, the first tab you see shows its scope — where this GPO is linked in AD. For the current policy, we can see it's only linked to the thm.local domain:"
      )}</P>
      <P>{t(
        "Ko'rib turganingizdek, siz GPO'larga xavfsizlik filtrini qo'llashingiz mumkin, shunda ular faqat OU ostidagi ma'lum foydalanuvchilar/kompyuterlarga qo'llaniladi. Odatiy bo'lib, ular barcha foydalanuvchilar/kompyuterlarni o'z ichiga olgan 'Autentifikatsiya qilingan foydalanuvchilar' guruhiga qo'llaniladi.",
        "As you can see, you can apply a security filter to GPOs so they only apply to specific users/computers under the OU. By default, they apply to the 'Authenticated Users' group, which includes all users and computers."
      )}</P>
      <img src="assets/gp/gp_s1_p3.png" alt="GPO Scope and Security Filtering" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <div style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 12, padding: "14px 18px", marginTop: 20 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginBottom: 8 }}>// ASOSIY TUSHUNCHALAR</div>
        <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.7 }}>
          <b style={{ color: "var(--text-0)" }}>GPO</b> — Guruh Siyosati Obyekti (sozlamalar to'plami)<br />
          <b style={{ color: "var(--text-0)" }}>OU</b> — Tashkiliy Birlik (foydalanuvchilar va kompyuterlar guruhi)<br />
          <b style={{ color: "var(--text-0)" }}>DC</b> — Domen Kontrolleri (AD ni boshqaruvchi server)<br />
          <b style={{ color: "var(--text-0)" }}>Meros</b> — GPO yuqori OUga bog'lansa, quyi OUlar ham uni oladi
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Lesson 41: GPO Sozlamalari va SYSVOL
// ─────────────────────────────────────────────────────────────
function SectionGPConfig() {
  const lang = useLang();
  const t = (uz, en) => lang === "en" ? en : uz;

  return (
    <section>
      <H2 num="§1" uz="GPO Sozlamalar yorlig'i" en="GPO Settings Tab" />
      <P>{t(
        "Sozlamalar yorlig'i GPO ning haqiqiy tarkibini o'z ichiga oladi va bizga u qanday aniq konfiguratsiyalarga tegishli ekanligini bildiradi. Har bir GPO faqat kompyuterlarga va faqat foydalanuvchilarga tegishli konfiguratsiyalarga ega. Bu holda, Standart Domen Siyosati faqat Kompyuter Konfiguratsiyalarini o'z ichiga oladi:",
        "The Settings tab contains the actual content of the GPO and tells us what specific configurations it applies. Each GPO can have configurations targeting computers only or users only. In this case, the Default Domain Policy only includes Computer Configurations:"
      )}</P>
      <img src="assets/gp/gp_s2_p1.png" alt="GPO Settings Tab" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§2" uz="Konfiguratsiyalarni kengaytirish" en="Expanding Configurations" />
      <P>{t(
        "Har bir konfiguratsiyaning o'ng tomonidagi 'ko'rsatish' havolalari yordamida GPO ni o'rganishingiz va mavjud elementlarni kengaytirishingiz mumkin. Bu holda, Standart Domen Siyosati parol va hisobni blokirovka qilish siyosati kabi ko'pgina domenlarga qo'llanilishi kerak bo'lgan asosiy konfiguratsiyalarni ko'rsatadi:",
        "Using the 'show' links on the right side of each configuration, you can explore the GPO and expand available items. In this case, the Default Domain Policy shows base configurations that need to apply across the domain — like password and account lockout policies:"
      )}</P>
      <img src="assets/gp/gp_s2_p2.png" alt="Expanding GPO Configurations" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§3" uz="Parol siyosatini o'zgartirish" en="Editing Password Policy" />
      <P>{t(
        "Ushbu GPO butun domenga tegishli bo'lganligi sababli, unga kiritilgan har qanday o'zgartirish barcha kompyuterlarga ta'sir qiladi. Keling, minimal parol uzunligi siyosatini foydalanuvchilarning parollarida kamida 10 ta belgi bo'lishi kerakligi uchun o'zgartiraylik. Buning uchun GPO ustiga sichqonchaning o'ng tugmasi bilan bosing va Tahrirlash-ni tanlang:",
        "Since this GPO applies to the entire domain, any changes made to it will affect all computers. Let's change the minimum password length policy so users must have at least 10 characters in their passwords. Right-click the GPO and select Edit:"
      )}</P>
      <img src="assets/gp/gp_s2_p3.png" alt="Editing Password Policy GPO" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§4" uz="GPO muharriri" en="GPO Editor" />
      <P>{t(
        "Bu biz mavjud bo'lgan barcha konfiguratsiyalarni ko'rib chiqishimiz va tahrirlashimiz mumkin bo'lgan yangi oynani ochadi. Minimal parol uzunligini o'zgartirish uchun:",
        "This opens a new window where we can browse and edit all available configurations. To change the minimum password length, navigate to:"
      )}</P>
      <Terminal>{`Kompyuter konfiguratsiyalari
  → Siyosat
    → Windows sozlamalari
      → Xavfsizlik sozlamalari
        → Hisob siyosati
          → Parol siyosati
            → Minimal parol uzunligi = 10`}</Terminal>
      <img src="assets/gp/gp_s2_p4.png" alt="GPO Editor - Password Policy Settings" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§5" uz="GPO da ko'plab sozlamalar" en="Extensive GPO Settings" />
      <P>{t(
        "Ko'rib turganingizdek, GPO da ko'plab siyosatlar o'rnatilishi mumkin. Ularning har birini bitta xonada tushuntirish imkonsiz bo'lsa-da, ba'zi siyosatlar sodda bo'lgani uchun biroz o'rganib chiqishingiz mumkin. Agar biron bir siyosat haqida ko'proq ma'lumot kerak bo'lsa, ularni ikki marta bosishingiz va har biridagi 'Tushuntirish' yorlig'ini o'qishingiz mumkin:",
        "As you can see, GPOs can have many policies configured. While explaining each one in a single lesson is impossible, some policies are straightforward enough to explore on your own. If you need more information about any policy, double-click it and read the 'Explain' tab:"
      )}</P>
      <img src="assets/gp/gp_s2_p5.png" alt="GPO Settings Overview" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§6" uz="GPO tarqatish — SYSVOL" en="GPO Distribution — SYSVOL" />
      <P>{t(
        "GPO'lar tarmoqqa DC (Domen Kontrolleri) tarkibida saqlanadigan SYSVOL deb nomlanuvchi umumiy tarmoq resursi orqali tarqatiladi. Domendagi barcha foydalanuvchilar o'z GPO'larini vaqti-vaqti bilan sinxronlashtirib turish uchun odatda tarmoq orqali ushbu resursga kirish huquqiga ega bo'lishi kerak.",
        "GPOs are distributed across the network via a shared network resource called SYSVOL, stored inside the Domain Controller. All domain users need access to this resource over the network to periodically synchronise their GPOs."
      )}</P>
      <P>{t(
        "SYSVOL umumiy resursi sukut bo'yicha tarmog'imizdagi har bir DC ning C:\\Windows\\SYSVOL\\sysvol\\ katalogiga yo'naltirilgan bo'ladi.",
        "The SYSVOL share is by default pointed to the C:\\Windows\\SYSVOL\\sysvol\\ directory on each DC in our network."
      )}</P>

      <div style={{ background: "rgba(255,180,0,0.07)", border: "1px solid rgba(255,180,0,0.25)", borderRadius: 12, padding: "14px 18px", marginTop: 8, marginBottom: 16 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-warn)", marginBottom: 6 }}>// MUHIM: GPO YANGILASH</div>
        <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.7 }}>
          {t(
            "Biron bir GPO'ga o'zgartirish kiritilgandan so'ng, kompyuterlar uni qabul qilishi uchun 2 soatgacha vaqt ketishi mumkin. Agar siz biron bir aniq kompyuterni zudlik bilan yangilashga majburlamoqchi bo'lsangiz:",
            "After a change is made to a GPO, computers may take up to 2 hours to receive it. To force an immediate update on a specific computer:"
          )}
        </div>
        <Terminal>C:\&gt; gpupdate /force</Terminal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Lesson 42: GPO Yaratish va Qo'llash
// ─────────────────────────────────────────────────────────────
function SectionGPCreate() {
  const lang = useLang();
  const t = (uz, en) => lang === "en" ? en : uz;

  return (
    <section>
      <H2 num="§1" uz="THM Inc. uchun GPO'lar yaratish" en="Creating GPOs for THM Inc." />
      <P>{t(
        "Yangi ishimizning bir qismi sifatida bizga quyidagilarni amalga oshirish imkonini beruvchi ba'zi GPO'larni joriy etish vazifasi yuklatildi:",
        "As part of our new role, we've been tasked with implementing GPOs that allow us to:"
      )}</P>
      <div style={{ background: "rgba(0,100,255,0.06)", border: "1px solid rgba(0,100,255,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.9 }}>
          <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", marginRight: 8 }}>1.</span>
          {t("IT bo'limiga kirmaydigan foydalanuvchilarning Boshqaruv paneliga (Control Panel) kirishini bloklash.", "Block access to the Control Panel for users who are not in the IT department.")}
          <br />
          <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)", marginRight: 8 }}>2.</span>
          {t("Foydalanuvchi 5 daqiqa davomida harakatsiz bo'lganidan keyin ish stantsiyalari va serverlarning ekranini avtomatik ravishda qulflashini ta'minlash.", "Make workstations and servers lock their screen automatically after 5 minutes of user inactivity.")}
        </div>
      </div>

      <H2 num="§2" uz="GPO 1: Boshqaruv paneliga kirishni cheklash" en="GPO 1: Restrict Control Panel Access" />
      <P>{t(
        "Biz barcha mashinalarda Boshqaruv paneliga kirishni faqat IT bo'limi tarkibiga kiruvchi foydalanuvchilar bilan cheklamoqchimiz. Keling, 'Restrict Control Panel Access' deb nomlangan yangi GPO yaratamiz va uni tahrirlash uchun ochamiz. Ushbu GPO muayyan foydalanuvchilarga qo'llanilishini xohlaganimiz sababli, biz User Configuration bo'limidan quyidagi siyosatni qidiramiz:",
        "We want to restrict Control Panel access on all machines to only users in the IT department. Let's create a new GPO called 'Restrict Control Panel Access' and open it for editing. Since we want this GPO applied to specific users, we look for the following policy under User Configuration:"
      )}</P>
      <Terminal>{`User Configuration
  → Policies
    → Administrative Templates
      → Control Panel
        → Prohibit access to Control Panel and PC settings: ENABLED`}</Terminal>
      <img src="assets/gp/gp_s3_p1.png" alt="Restrict Control Panel GPO Setting" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 8 }} />
      <P style={{ fontSize: 12, color: "var(--text-2)" }}>{t(
        "E'tibor bering, biz 'Boshqaruv paneli va kompyuter sozlamalariga kirishni taqiqlash' siyosatini yoqdik.",
        "Notice we enabled the 'Prohibit access to Control Panel and PC settings' policy."
      )}</P>

      <H2 num="§3" uz="GPO ni OU'larga bog'lash" en="Linking GPO to OUs" />
      <P>{t(
        "GPO sozlangandan so'ng, biz uni shaxsiy kompyuterlarining boshqaruv paneliga kirish huquqiga ega bo'lmasligi kerak bo'lgan foydalanuvchilarga mos keladigan barcha OU'larga bog'lashimiz kerak bo'ladi. Bu holda, biz GPO'ni Marketing, Menejment va Savdo OU'lariga bog'laymiz:",
        "Once the GPO is configured, we need to link it to all OUs corresponding to users who shouldn't have Control Panel access. In this case, we link the GPO to the Marketing, Management, and Sales OUs:"
      )}</P>
      <img src="assets/gp/gp_s3_p2.png" alt="Linking GPO to OUs" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§4" uz="GPO 2: Avtomatik ekran qulflash" en="GPO 2: Auto Lock Screen" />
      <P>{t(
        "Birinchi GPO uchun, ish stantsiyalari va serverlar uchun ekranni qulflash bilan bog'liq holda, biz uni avval yaratgan Ish stantsiyalari, Serverlar va Domen Kontrollerlari OU'lariga to'g'ridan-to'g'ri qo'llashimiz mumkin.",
        "For the lock screen GPO, we can directly apply it to the Workstations, Servers, and Domain Controllers OUs we created earlier."
      )}</P>
      <P>{t(
        "Ushbu yechim ishlashi kerak bo'lsa-da, alternativa shunchaki GPO'ni ildiz domeniga qo'llashdan iborat, chunki biz GPO barcha kompyuterlarimizga ta'sir qilishini xohlaymiz. Ish stantsiyalari, Serverlar va Domen Kontrollerlari OU'larining barchasi ildiz domenining bolalar OU'lari bo'lgani uchun, ular uning siyosatlarini meros qilib oladilar.",
        "While that solution should work, an alternative is to simply apply the GPO to the root domain, since we want the GPO to affect all our computers. Since all Workstations, Servers, and DC OUs are child OUs of the root domain, they will inherit its policies."
      )}</P>
      <P>{t(
        "Keling, yangi GPO yarataylik, uni 'Avtomatik Qulflash Ekrani' deb nomlaymiz va uni tahrirlaymiz. Biz xohlagan narsaga erishish uchun siyosat quyidagi yo'nalishda joylashgan:",
        "Let's create a new GPO called 'Auto Lock Screen' and edit it. To achieve what we want, the policy is located at:"
      )}</P>
      <Terminal>{`Computer Configuration
  → Policies
    → Windows Settings
      → Security Settings
        → Local Policies
          → Security Options
            → Interactive logon: Machine inactivity limit = 300 seconds`}</Terminal>
      <img src="assets/gp/gp_s3_p3.png" alt="Auto Lock Screen GPO Path" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§5" uz="Harakatsizlik chegarasini belgilash" en="Setting the Inactivity Limit" />
      <P>{t(
        "Agar foydalanuvchi sessiyasini ochiq qoldirsa, kompyuterlar avtomatik ravishda qulflanishi uchun biz harakatsizlik chegarasini 5 daqiqaga (300 soniya) o'rnatamiz. GPO muharririni yopgandan so'ng, biz GPO'ni unga sudrab, uni asosiy domenga bog'laymiz:",
        "We set the inactivity limit to 5 minutes (300 seconds) so computers automatically lock if the user leaves their session open. After closing the GPO editor, we link the GPO to the root domain by dragging it:"
      )}</P>
      <img src="assets/gp/gp_s3_p4.png" alt="Setting Inactivity Limit" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <H2 num="§6" uz="GPO'larni sinash" en="Testing GPOs" />
      <P>{t(
        "GPO'lar to'g'ri OU'larga qo'llanilgandan so'ng, biz tekshirish uchun Marketing, Savdo yoki Menejment bo'limiga istalgan foydalanuvchi sifatida kirishimiz mumkin. Ushbu vazifa uchun Mark ning hisob ma'lumotlaridan foydalanib RDP orqali ulanaylik:",
        "Once GPOs are applied to the correct OUs, we can log in as any user from Marketing, Sales, or Management to verify. Let's connect via RDP using Mark's credentials for this task:"
      )}</P>
      <Terminal>{`RDP ulanish:
  Foydalanuvchi: THM\\Mark

Agar boshqaruv paneliga kirishga harakat qilsak:
  → Administrator tomonidan rad etildi ✓

Ekran avtomatik qulflanishini tekshirish:
  → 5 daqiqa kuting → Avtomatik qulflash ✓`}</Terminal>
      <img src="assets/gp/gp_s3_p5.png" alt="Testing GPO as Marketing User" style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 16 }} />

      <div style={{ background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 12, padding: "14px 18px", marginTop: 8 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c-attack)", marginBottom: 6 }}>// ESLATMA</div>
        <div style={{ fontSize: 12.5, color: "var(--text-1)", lineHeight: 1.7 }}>
          {t(
            "Agar siz GPO'larni yaratgan va bog'lagan bo'lsangiz, lekin biron sababga ko'ra ular hali ham ishlamasa, GPO'larni yangilashga majbur qilish uchun quyidagi buyruqni ishga tushiring:",
            "If you've created and linked the GPOs but they still aren't working for some reason, you can force an update with:"
          )}
          <br /><br />
          <code style={{ background: "rgba(0,0,0,0.3)", padding: "2px 8px", borderRadius: 4, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>gpupdate /force</code>
        </div>
      </div>
    </section>
  );
}

window.SectionGPIntro  = SectionGPIntro;
window.SectionGPConfig = SectionGPConfig;
window.SectionGPCreate = SectionGPCreate;
