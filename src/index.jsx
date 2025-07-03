import { effect, memo, ref, render, signal } from 'pota'
import { bind } from 'pota/use/bind'

import styles from './index.module.css'
import { mutable } from 'pota/store'
import { For, Show } from 'pota/components'

import chroma from 'chroma-js'

import bg1 from './assets/MainBackground4Texture.webp'
import bg2 from './assets/MainBackground8Texture.webp'
import bg3 from './assets/MainBackground9Texture.webp'
import { useTimeout } from 'pota/use/time'

function pd(e) {
	e.preventDefault()
}

function Display(props) {
	console.log('display ran')
	const splitInput = memo(() => props.input().split(''))
	let lastColor = '#ffffff'
	const colorFill = memo(() =>
		props.colors.placement.map((color, i) => {
			if (color) {
				lastColor = color
			} else {
				if (i === 0) lastColor = '#ffffff'
			}
			return color || lastColor
		}),
	)

	return (
		<section>
			<h2>Display</h2>
			<p>
				<For each={splitInput} reactiveIndex>
					{(letter, i) => (
						<span style:color={() => colorFill()[i()] || 'white'}>
							{letter}
						</span>
					)}
				</For>
			</p>
			<Show when={props.debug}>
				{() => JSON.stringify(colorFill())}
			</Show>
		</section>
	)
}

function UserInput(props) {
	console.log('user input ran')
	effect(() => {
		props.colors.placement = new Array(props.input().length).fill(
			null,
		)
	})
	return (
		<section>
			<h2>Input</h2>
			<form on:submit={pd}>
				<input use:bind={props.input} />
			</form>
		</section>
	)
}

function Colors(props) {
	console.log('colors ran')
	function add(e) {
		props.colors.list.push(e.currentTarget.value)
	}
	function remove(index) {
		console.log('removing', index)
		props.colors.list.splice(index, 1)
	}
	function getColor(color) {
		const wd = chroma.distance('#fff', color, 'rgb')
		const bd = chroma.distance('#000', color, 'rgb')

		return wd > bd ? 'white' : 'black'
	}

	return (
		<section>
			<h2>Colors</h2>
			<form on:submit={pd}>
				<input type="color" on:change={add} />
				<div class={styles.colors}>
					<For each={props.colors.list} reactiveIndex>
						{(color, i) => (
							<div
								class={styles.colorView}
								style:color={() => getColor(color)}
								style:background-color={color}
								on:click={() => remove(i())}
							>
								{i}
							</div>
						)}
					</For>
				</div>
			</form>
		</section>
	)
}

function Method(props) {
	console.log('method ran')
	function setMethod(e) {
		props.setMethod(e.target.value)
	}
	return (
		<section>
			<h2>Method</h2>
			<form on:submit={pd}>
				<select on:change={setMethod}>
					<option value="grad">Gradient</option>
					<option value="manual">Manual</option>
				</select>
			</form>
		</section>
	)
}

function ManualBuilderPart(props) {
	console.log('manual builder part ran')
	function setColorPlacement(e) {
		const color = e.target.value || null
		props.colors.placement[props.index()] = color
	}
	return (
		<div style:display="flex" style:flex-direction="column">
			<Show when={props.letter !== ' '}>
				<select on:change={setColorPlacement}>
					<option value=""> </option>
					<For each={props.colors.list} reactiveIndex>
						{(color, i) => <option value={color}>{i}</option>}
					</For>
				</select>
			</Show>
			{props.letter}
		</div>
	)
}

function ManualBuilder(props) {
	console.log('manual builder ran')
	const inputArray = memo(() => props.input().split(''))
	return (
		<section>
			<h2>Manual builder</h2>
			<form on:submit={pd}>
				<div class={styles.manualBuilderParts} style:display="flex">
					<For each={inputArray} reactiveIndex>
						{(letter, i) => (
							<ManualBuilderPart
								letter={letter}
								colors={props.colors}
								index={i}
							/>
						)}
					</For>
				</div>
			</form>
		</section>
	)
}

function GradientBuilder(props) {
	console.log('gradient builder ran')
	const mode = bind('lch')
	function setColorPlacements() {
		if (props.colors.list.length < 2)
			return props.setBanner(last => ({
				...last,
				message: 'Select at least two colors',
				backgroundColor: 'red',
				duration: 10,
			}))

		const colors = Object.assign([], props.colors.list)
		const scale = chroma
			.scale(colors)
			.mode(mode())
			.colors(props.input().length)
		for (let i = 0, len = scale.length; i < len; i++) {
			props.colors.placement[i] = scale[i]
		}
	}

	const modes = [
		//'hcg',
		'hsi',
		'hsl',
		'hsv',
		'lab',
		'lch',
		'lrgb',
		'num',
		'oklab',
		'oklch',
		'rgb',
	]
	const defaultMode = 'lch'

	return (
		<section>
			<h2>Gradient Builder</h2>
			<form on:submit={pd}>
				<label>
					Mode:
					<select use:bind={mode} on:change={setColorPlacements}>
						<For each={modes}>
							{m => (
								<option value={m} selected={() => mode() === m}>
									{m.toUpperCase()}
								</option>
							)}
						</For>
					</select>
				</label>
				<button
					on:click={setColorPlacements}
					class={{
						[styles.disabled]: props.colors.list.length < 2,
					}}
				>
					Apply
				</button>
			</form>
		</section>
	)
}

function Output(props) {
	console.log('output ran')
	const splitInput = memo(() => props.input().split(''))
	const output = ref()
	function copy() {
		try {
			navigator.clipboard.writeText(output().value)
			props.setBanner(last => ({
				...last,
				message: 'Copied to clipboard',
				backgroundColor: 'green',
				color: 'white',
				duration: 10,
			}))
		} catch (error) {
			props.setBanner(last => ({
				...last,
				message: error,
				backgroundColor: 'red',
				color: 'white',
				duration: 10,
			}))
		}
	}
	return (
		<section>
			<h2>Output</h2>
			<form on:submit={pd}>
				<textarea use:ref={output}>
					<For each={splitInput} reactiveIndex>
						{(letter, i) => (
							<Show
								when={() =>
									letter !== ' ' && props.colors.placement[i()]
								}
								fallback={letter}
							>
								[{() => props.colors.placement[i()].slice(1)}]{letter}
							</Show>
						)}
					</For>
				</textarea>
				<button on:click={copy}>Copy</button>
			</form>
		</section>
	)
}

function Colorizer(props) {
	console.log('colorizer ran')
	const debug = bind(false)
	const input = bind('Guest1')
	const colors = mutable({
		list: [],
		placement: new Array(input().length).fill(null),
	})

	const [method, setMethod] = signal('grad')
	const showingManual = memo(() => method() === 'manual')

	return (
		<div class={styles.colorizer}>
			<UserInput input={input} colors={colors} />
			<Colors colors={colors} />
			<Method setMethod={setMethod} />
			<Show
				when={showingManual}
				fallback={
					<GradientBuilder
						input={input}
						colors={colors}
						setBanner={props.setBanner}
					/>
				}
			>
				<ManualBuilder input={input} colors={colors} />
			</Show>
			<Display input={input} colors={colors} debug={debug} />
			<Output
				input={input}
				colors={colors}
				setBanner={props.setBanner}
			/>
			{/* <label>
				Debug
				<input type="checkbox" use:bind={debug} />
			</label>
			<br /> */}
			<Show when={debug}>
				{() => JSON.stringify(input())} <br />
				{() => JSON.stringify(colors)} <br />
				{() => JSON.stringify(method())} <br />
				{() => JSON.stringify(props.banner())}
			</Show>
		</div>
	)
}

function Banner(props) {
	console.log('banner ran')
	useTimeout(dispose, duration).start()

	function dispose() {
		props.setBanner(last => ({ ...last, message: '' }))
	}
	function duration() {
		return props.banner().duration * 1000
	}

	return (
		<div
			class={styles.banner}
			style:background-color={() => props.banner().backgroundColor}
			style:color={() => props.banner().color}
		>
			{() => props.banner().message}
		</div>
	)
}

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
			<header>AoTTG Name Colorizer</header>
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
