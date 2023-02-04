import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';

import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import useMediaQuery from '../Hooks/useMediaQuery';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Bottom() {
  const matchesXS = useMediaQuery("(min-width: 360px)");
  const matchesXXS = useMediaQuery("(min-width: 322px)");
  const matchesXXXS = useMediaQuery("(min-width: 263px)");

  const definePSize = () => {
    if (matchesXS) {
      return 16;
    } else if (matchesXXS) {
      return 14;
    } else if (matchesXXXS) {
      return 12;
    } else {
      return 10;
    }
  }

  const pSize = definePSize();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: -20, marginTop: -20, color: 'white' }}>
      <p style={{ fontSize: pSize }}>©Axos inc. 2023</p>
      <p style={{ fontSize: pSize }}>aleksei.shevelenkov@gmail.com</p>
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
  )
}

export default Myfooter;