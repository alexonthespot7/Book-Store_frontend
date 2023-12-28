import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';

import useMediaQuery from '../Hooks/useMediaQuery';

function Bottom() {
  const matches360px = useMediaQuery("(min-width: 360px)");
  const matches322px = useMediaQuery("(min-width: 322px)");
  const matches263px = useMediaQuery("(min-width: 263px)");

  const defineFontSize = () => {
    if (matches360px) {
      return 16;
    } else if (matches322px) {
      return 14;
    } else if (matches263px) {
      return 12;
    } else {
      return 10;
    }
  }

  const fontSize = defineFontSize();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 0, marginTop: 0, color: 'white' }}>
      <p style={{ fontSize: fontSize }}>©Axos inc. 2023</p>
      <p style={{ fontSize: fontSize }}>aleksei.shevelenkov@gmail.com</p>
    </div>
  );
}

function Myfooter() {
  return (
    <Footer
      theme='dark'
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
            },
            {
              title: 'LinkedIn',
              url: 'https://linkedin.com/in/alexonthespot',
              openExternal: true,
              icon: (<LinkedInIcon />)
            }
          ]
        },
      ]}
      bottom=<Bottom />
    />
  );
}

export default Myfooter;