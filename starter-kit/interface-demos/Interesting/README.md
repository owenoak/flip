Interesting-Menu
=
Recreation of the Capptivate example from the Interesting for iPhone app, specifically the left-right sliding transition of the menu and animation of the individual menu items.

Example : http://capptivate.co/2014/01/18/interesting-2/

User can swipe left or right to slide the menu out, in addition to using the "hamburger" button at the top left.  There is both a position and velocity threshold for revealing the menu when drag is released.  Navigation items are eased into place with an opacity change.  Nav items will "follow" each other into position based on a time delay.
Setup
=
```
git clone https://github.com/FamousPrivateBeta/Interesting-Menu.git
cd Interesting-Menu
git submodule update --init --recursive
```
Set Chrome developer mode to emulate screen (640x1096 with device pixel ratio of 2) with touch emulation.
Applied
=
Famous Engine, submodule 0.0.4

Surface Container Transitions Easing Transitionable Generic Sync Timer Views
