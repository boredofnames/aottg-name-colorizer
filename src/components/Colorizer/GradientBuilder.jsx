import { pd } from '@js/utils.js'
import chroma from 'chroma-js'
import { For } from 'pota/components'
import { bind } from 'pota/use/bind'
import styles from './index.module.css'

export default function GradientBuilder(props) {
	const mode = bind('lch')
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
						[styles.disabled]: () => props.colors.list.length < 2,
					}}
				>
					Apply
				</button>
			</form>
		</section>
	)
}
