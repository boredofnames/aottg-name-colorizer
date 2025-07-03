import { memo, signal } from 'pota'
import { Show } from 'pota/components'
import { mutable } from 'pota/store'
import { bind } from 'pota/use/bind'
import Colors from './Colors.jsx'
import Display from './Display.jsx'
import GradientBuilder from './GradientBuilder.jsx'
import ManualBuilder from './ManualBuilder.jsx'
import Method from './Method.jsx'
import Output from './Output.jsx'
import UserInput from './UserInput.jsx'
import styles from './index.module.css'

export default function Colorizer(props) {
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
