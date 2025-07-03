import { memo } from 'pota'
import { For, Show } from 'pota/components'

export default function Display(props) {
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
