import {Route, withRouter, useLocation} from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {personAdd, alert, home, card, image, chatbox} from 'ionicons/icons';
import Cost from './pages/Cost';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Login from './pages/Login';
import History from './pages/History';
import Account from "./pages/account";
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { Provider } from 'react-redux';
import store from "./store";
import {useEffect, useState} from "react";
import CameraCapture from "./pages/camera";
import Survey from "./pages/survey";

setupIonicReact();
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return(
  <IonApp>
    <Provider store={store}>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/tab3">
            <Tab3 />
          </Route>
          <Route path="/Survey">
          <Survey />
         </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route path="/tab4">
            <Tab4 />
          </Route>
          <Route path="/Cost">
            <Cost />
          </Route>
          <Route path="/Camera">
            <CameraCapture/>
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route exact path="/">
            <Login/>
          </Route>
        </IonRouterOutlet>
        {isLoggedIn && (
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/Camera">
            <IonIcon aria-hidden="true" icon={home}  style={{color:'#02796b'}}/>
            <IonLabel style={{color:'#02796b'}}>Measure</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={alert} style={{color:'#02796b'}} />
            <IonLabel style={{color:'#02796b'}}>Reminder</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/tab3">
            <IonIcon aria-hidden="true" icon={chatbox} style={{color:'#02796b'}}/>
            <IonLabel style={{color:'#02796b'}}>Blood</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab4" href="/tab4">
            <IonIcon aria-hidden="true" icon={personAdd} style={{color:'#02796b'}}/>
            <IonLabel style={{color:'#02796b'}}>User</IonLabel>
          </IonTabButton>
        </IonTabBar>
        )}
      </IonTabs>
    </IonReactRouter>
    </Provider>
  </IonApp>
);
}

export default App;
