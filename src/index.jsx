import { render, signal } from 'pota'
import githubLogo from './assets/github.svg'
import paypalLogo from './assets/paypal.svg'
import bg1 from './assets/MainBackground4Texture.webp'
import bg2 from './assets/MainBackground8Texture.webp'
import bg3 from './assets/MainBackground9Texture.webp'
import Banner from './components/Banner/index.jsx'
import Colorizer from './components/Colorizer/index.jsx'
import styles from './index.module.css'

function App() {
	console.log('app ran')
	function cycleBg() {
		if (bgIndex() < bgs.length - 1) setBgIndex(bgIndex() + 1)
		else setBgIndex(0)
	}
	const bgs = [bg1, bg2, bg3]
	const bgInterval = setInterval(cycleBg, 60 * 1000)
	const [bgIndex, setBgIndex] = signal(0)
	const [banner, _, updateBanner] = signal({
		message: '',
		backgroundColor: 'purple',
		color: 'white',
		duration: 5,
	})

	return (
		<div
			class={styles.app}
			style:background-image={() => `url(${bgs[bgIndex()]})`}
		>
			<header>
				<div>
					<a href="https://ehmeh.com">EhMeh</a> -{' '}
					<a href="https://aottg-nc.ehmeh.com">
						AoTTG Name Colorizer
					</a>
				</div>
				<div>
					<a href="https://github.com/boredofnames/aottg-name-colorizer">
						<img
							src={githubLogo}
							alt="GitHub"
							width="24px"
							title="Code"
						/>
					</a>
					<a href="https://www.paypal.com/paypalme/4z3r0d3v">
						<img
							src={paypalLogo}
							alt="Donate"
							width="24px"
							title="Buy me a matcha!"
						/>
					</a>
				</div>
			</header>
			<main>
				<div class={styles.mainInner}>
					<Banner banner={banner} setBanner={updateBanner} />
					<Colorizer banner={banner} setBanner={updateBanner} />
				</div>
			</main>
		</div>
	)
}

render(App)
