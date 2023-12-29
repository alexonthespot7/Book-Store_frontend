import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import Footer from 'rc-footer';
import 'rc-footer/assets/index.css';

import useMediaQuery from '../Hooks/useMediaQuery';

function Bottom() {
  const matches550px = useMediaQuery("(min-width: 550px)");
  const matches450px = useMediaQuery("(min-width: 450px)");
  const matches263px = useMediaQuery("(min-width: 263px)");

  const defineFontSize = () => {
    if (matches550px) {
      return 16;
    } else if (matches450px) {
      return 15;
    } else if (matches263px) {
      return 14;
    } else {
      return 12;
    }
  }
  const fontSize = defineFontSize();
  const horizontalMargin = matches550px ? '5%' : '2.5%';
  const direction = matches450px ? 'row' : 'column-reverse';

  return (
    <div style={{ display: 'flex', flexDirection: direction, justifyContent: 'space-between', marginLeft: horizontalMargin, marginRight: horizontalMargin, color: 'white' }}>
      <p style={{ fontSize: fontSize }}>©Axos inc. 2023</p>
      <p style={{ fontSize: fontSize }}>aleksei.shevelenkov@gmail.com</p>
    </div>
  );
}

function MyFooter() {
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

export default MyFooter;