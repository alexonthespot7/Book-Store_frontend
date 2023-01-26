import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';

import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

function Bottom() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: -20, marginTop: -20 }}>
      <p>©Axos inc. 2023</p>
      <p>aleksei.shevelenkov@gmail.com</p>
    </div>
  );
}

function Myfooter() {
  return (
    <Footer
      theme='light'
      columns={[
        {
          icon: (
            <ContactSupportIcon />
          ),
          title: 'Get in touch',
          items: [
            {
              title: 'Telegram',
              url: 'https://t.me/axosinc',
              openExternal: true,
              icon: (<TelegramIcon />)
            },
            {
              title: 'Instagram',
              url: 'https://www.instagram.com/mark_eto_leha_dobav',
              openExternal: true,
              icon: (<InstagramIcon />)
            },
            {
              title: 'GitHub',
              url: 'https://github.com/alexonthespot7',
              openExternal: true,
              icon: (<GitHubIcon />)
            }
          ]
        },
      ]}
      bottom=<Bottom />
    />
  )
}

export default Myfooter;