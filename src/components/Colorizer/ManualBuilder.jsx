import { pd } from '@js/utils.js'
import { memo } from 'pota'
import { For, Show } from 'pota/components'
import styles from './index.module.css'

function ManualBuilderPart(props) {
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

export default function ManualBuilder(props) {
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
