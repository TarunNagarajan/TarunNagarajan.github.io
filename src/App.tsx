import { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './App.css';

// Robust Latex component that avoids string prop escaping issues
const Latex = ({ formula, block = false }: { formula: string, block?: boolean }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(formula, containerRef.current, {
        throwOnError: false,
        displayMode: block,
        strict: false
      });
    }
  }, [formula, block]);

  return <span ref={containerRef} />;
};

const projects = [
  {
    id: 'compiler-opt',
    title: 'Hierarchical Multi-Agent RL for Compiler Optimization',
    date: 'March 2026',
    summary: 'Autonomous discovery of optimal LLVM compiler pass sequences using a hierarchical multi-agent framework with Foveated GNNs and Two-Hot SymLog Binning.',
    github: 'https://github.com/TarunNagarajan/compiler-opt',
    content: () => (
      <>
        <p>
          The compilation phase-ordering problem—determining the optimal sequence of code-transforming optimization passes—is a combinatorial explosion in a non-Euclidean space. Modern compilers like GCC and LLVM bypass this NP-hard search space by employing static, heuristic-driven pipelines (e.g., <code>-O2</code>, <code>-O3</code>). These heuristics, while effective on average, fail to capture the unique <strong>topological invariants</strong> and <strong>data-flow semantics</strong> of specific high-performance kernels.
        </p>
        <p>
          This research treats compiler optimization as a continuous, non-stationary <strong>Markov Decision Process (MDP)</strong> and employs <strong>Hierarchical Multi-Agent Reinforcement Learning (HRL)</strong> to navigate the high-dimensional manifold of LLVM pass interactions. We frame the problem through the lens of <strong>Information Bottleneck Theory</strong>, seeking to compress the program representation while maximizing the mutual information with respect to the execution speedup.
        </p>
        
        <h2>Graph Topology and the Over-Smoothing Bottleneck</h2>
        <p>
          We model the LLVM Intermediate Representation (IR) as a unified property graph <Latex formula={String.raw`\mathcal{G} = (V, E)`} />. This graph is a heterogeneous construct containing the Control Flow Graph (CFG) and Data Dependence Graph (DDG). To resolve the tension between global context retrieval and local signal preservation, we engineered a <strong>Foveated Perception architecture</strong>. 
        </p>
        <p>
          In traditional GNNs, the <strong>over-smoothing phenomenon</strong> causes node features to converge to a stationary distribution as the number of layers <Latex formula={String.raw`L \to \infty`} />, effectively losing the <strong>Jacobian sensitivity</strong> of individual instructions. Our foveated approach imposes a dual-resolution topology using an adaptive <code>block_map</code> that dynamically adjusts the <strong>spectral gap</strong> of the graph Laplacian <Latex formula={String.raw`\Delta = D - A`} />.
        </p>
        <p>
          In the <strong>Fovea</strong>, the mapping is strictly isomorphic (<Latex formula={String.raw`1:1`} />). In the <strong>Periphery</strong>, instructions undergo <strong>Hierarchical Block Condensation (HBC)</strong> via a deterministic scatter-reduction. This can be viewed as an approximation of the <strong>Schur Complement</strong> of the graph Laplacian, reducing the dimensionality while preserving the <strong>effective resistance</strong> between key IR blocks:
        </p>
        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '1.5rem 0' }}>
          <Latex block formula={String.raw`X'_{active} = \text{scatter\_mean}(X, B)`} />
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', opacity: 0.8 }}>
            where <Latex formula={String.raw`B \in \mathbb{N}^{|V|}`} /> represents the dominance-frontier block assignment vector. This achieves an <strong>86% reduction in graph nodes</strong> while maintaining the <strong>homology</strong> of the original data-flow.
          </p>
        </div>

        <h2>Non-Commutative Algebra and Lie Brackets</h2>
        <p>
          A critical insight of this work is that compiler passes <Latex formula={String.raw`p_i, p_j`} /> do not commute. That is, the <strong>Lie Bracket</strong> <Latex formula={String.raw`[p_i, p_j] = p_i p_j - p_j p_i \neq 0`} />. This non-commutativity defines the curvature of the optimization landscape. We employ a <strong>Recurrent Meta-Controller</strong> that learns to approximate the <strong>Baker-Campbell-Hausdorff formula</strong> for pass sequences, predicting the resultant transformation <Latex formula={String.raw`Z`} /> such that:
        </p>
        <Latex block formula={String.raw`e^{p_i} e^{p_j} = e^{p_i + p_j + \frac{1}{2}[p_i, p_j] + \dots}`} />

        <h2>Fail-Safe Distributional Reasoning</h2>
        <p>
          To solve the gradient variance issues inherent in heterogeneous file scales (the "Linear Trap"), we implemented <strong>Categorical Distributional Reasoning</strong> using <strong>Two-Hot SymLog Binning</strong>. The continuous performance target <Latex formula={String.raw`y`} /> is projected into a symmetric logarithmic space to compress the dynamic range of execution times:
        </p>
        <Latex block formula={String.raw`z = \text{sign}(y) \cdot \ln(1 + |y|)`} />
        <p>
          The network predicts a categorical distribution <Latex formula={String.raw`\hat{P}`} /> over 255 discrete bins spanning <Latex formula={String.raw`[-20\%, +20\%]`} />. The "Two-Hot" encoding distributes the probability mass <Latex formula={String.raw`P`} /> to the nearest bins <Latex formula={String.raw`b_i, b_{i+1}`} />. This ensures that the <strong>Kullback-Leibler (KL) Divergence</strong> between the predicted and target distributions is well-behaved even for extreme outliers:
        </p>
        <Latex block formula={String.raw`P_{b_i} = 1 - \text{dist}(z, b_i), \quad P_{b_{i+1}} = 1 - P_{b_i}`} />
        <p>
          The system is optimized via Cross-Entropy, which in this context acts as a <strong>Maximum Likelihood Estimator</strong> for the non-stationary reward distribution:
        </p>
        <Latex block formula={String.raw`\mathcal{L} = -\sum_{b \in \mathcal{B}} P_b \log(\hat{P}_b)`} />
        <p>
          By strictly bounding the gradients within <Latex formula={String.raw`[-1, 1]`} />, we enforce <strong>Lipschitz continuity</strong> on the policy network, rendering numerical explosions mathematically impossible.
        </p>

        <h2>Spectral Stability in SSA-Graphs</h2>
        <p>
          The utilization of <strong>Static Single Assignment (SSA)</strong> form transforms the IR from a simple sequential list into a <strong>Directed Acyclic Graph (DAG)</strong> of value dependencies. This property is foundational to our GNN's stability; because each variable is assigned exactly once, the <strong>def-use chains</strong> represent unique, non-ambiguous flow paths. We exploit the <strong>dominance frontier</strong> of the SSA-graph to prune redundant message-passing routes, effectively reducing the <strong>spectral radius</strong> of the transition matrix and preventing the divergence of the node embeddings during deep recursive passes.
        </p>
        <p>
          A significant engineering challenge was the <strong>Zero-Cost Execution Estimation</strong>. In an RL loop, executing the full LLVM toolchain for every pass sequence is computationally prohibitive. We developed a <strong>Surrogate Cost Model</strong> that predicts the relative speedup by analyzing the <strong>Instruction-Level Parallelism (ILP)</strong> and <strong>cache-locality heuristics</strong> extracted from the graph. The surrogate is trained to minimize the <strong>Rank-Correlation Loss</strong> against actual hardware execution traces, allowing the agent to perform millions of "mental" simulations before validating on physical silicon.
        </p>
        <p>
          For the hierarchical coordination between the global sequence-manager and the local pass-optimizer, we evaluated <strong>Proximal Policy Optimization (PPO)</strong> against <strong>Soft Actor-Critic (SAC)</strong>. While SAC offers superior sample efficiency in continuous domains, we found that its <strong>entropy maximization</strong> objective often led to "pass-thrashing"—applying oscillatory transformations that maintained logical equivalence but increased code size. We ultimately opted for a <strong>Hierarchical PPO (H-PPO)</strong> architecture, where the manager's <strong>clipped objective</strong> enforces policy stability across long horizons, ensuring that the discovered sequences converge to <strong>monotonically improving</strong> execution manifolds.
        </p>

        <h2>Action-State Attention Mechanics</h2>
        <p>
          We introduced a <strong>Multi-Head Cross-Attention</strong> module where the candidate optimization pass <Latex formula={String.raw`a`} /> acts as a Query against the state vector <Latex formula={String.raw`s`} />. This computes the <strong>relevance manifold</strong> of the IR:
        </p>
        <Latex block formula={String.raw`\text{Attention}(Q_a, K_s, V_s) = \text{softmax}\left(\frac{Q_a K_s^T}{\sqrt{d_k}}\right)V_s`} />
        <p>
          This allows the model to selectively "attend" to relevant sub-graphs based on the action being queried—focusing on <strong>loop-nest manifolds</strong> for unrolling passes or <strong>call-graph hierarchies</strong> for inlining.
        </p>
      </>
    )
  },
  {
    id: 'task-quant',
    title: 'TaskQuant: Selective Quantization for LLMs',
    date: 'November 2025',
    summary: 'Task-aware selective quantization strategy for Microsoft Phi-2 and Llama-3 that preserves structural "load-bearing" components using Fisher Information.',
    github: 'https://github.com/TarunNagarajan/TaskQuant',
    content: () => (
      <>
        <p>
          Standard uniform Post-Training Quantization (PTQ) triggers catastrophic <strong>feature collapse</strong> on reasoning-heavy tasks. This research formulates <strong>Task-Aware Selective Quantization</strong>, mathematically isolating the network sub-components that constitute the <strong>inductive biases</strong> necessary for specific cognitive domains.
        </p>

        <h2>Hessian Approximations and the Riemann Metric</h2>
        <p>
          To rigorously quantify parameter importance, we treat the neural network as a point on a <strong>Riemannian manifold</strong>. The <strong>Fisher Information Matrix (FIM)</strong> serves as the natural metric tensor for this space, providing a first-order approximation of the <strong>Hessian of the loss landscape</strong>. For a parameter <Latex formula={String.raw`\theta`} /> and task-specific distribution <Latex formula={String.raw`\mathcal{D}`} />, the empirical Fisher Information <Latex formula={String.raw`F(\theta)`} /> is:
        </p>
        <Latex block formula={String.raw`F(\theta) = \mathbb{E}_{x \sim \mathcal{D}} \left[ \left( \nabla_\theta \ln p(y|x, \theta) \right)^2 \right]`} />
        <p>
          We normalize sensitivity across asymmetric network layers using the <strong>Fisher Information Density</strong> <Latex formula={String.raw`\rho_F`} />. This allows us to identify <strong>critical points</strong> where the <strong>Shannon entropy</strong> of the weight distribution is most sensitive to precision reduction:
        </p>
        <Latex block formula={String.raw`\rho_F = \frac{1}{|P|} \sum_{\theta \in P} F(\theta)`} />
        
        <p>
          In <strong>Phi-2 (2.7B)</strong>, this revealed extreme densities in the final <strong>Coherence Gate (Layer 29)</strong>. Despite being numerically small, these weights possess a Fisher density 14x higher than the model average, indicating they are <strong>"load-bearing" parameters</strong> in the model's logical manifold.
        </p>

        <h2>Phase Shifts in Rotary Manifolds</h2>
        <p>
          Through qualitative analysis, we identified a failure mode termed <strong>Rotational Aliasing</strong>. Because Rotary Position Embeddings (RoPE) rely on precise <strong>unitary transformations</strong> in a complex space:
        </p>
        <Latex block formula={String.raw`\mathbf{q}'_m = \mathbf{R}_m \mathbf{q}_m, \quad \mathbf{k}'_n = \mathbf{R}_n \mathbf{k}_n`} />
        <p>
          Quantizing the corresponding projection matrices <Latex formula={String.raw`W_q, W_k`} /> introduces a <strong>phase shift</strong> <Latex formula={String.raw`\delta`} />. This causes distinct tokens to algebraically "alias" or collapse into a single manifold point when the <strong>inner product</strong> deviates significantly:
        </p>
        <Latex block formula={String.raw`\langle \mathbf{q}'_m, \mathbf{k}'_n \rangle \approx \langle \mathbf{q}_m, \mathbf{k}_n \rangle + \epsilon(\delta)`} />
        <p>
          where <Latex formula={String.raw`\epsilon(\delta)`} /> exceeds the <strong>softmax temperature</strong>, resulting in variable aliasing (e.g., the model losing the ability to distinguish between <Latex formula={String.raw`x_i`} /> and <Latex formula={String.raw`x_j`} /> in high-dimensional space).
        </p>

        <h2>Energy-Based Pruning and Singular Values</h2>
        <p>
          We further refine the quantization mask by performing <strong>Singular Value Decomposition (SVD)</strong> on the weight matrices <Latex formula={String.raw`W = U \Sigma V^T`} />. We preserve the <strong>topological energy</strong> of the matrix by keeping the top-k singular values in full precision:
        </p>
        <Latex block formula={String.raw`E = \frac{\sum_{i=1}^k \sigma_i^2}{\sum_{j=1}^n \sigma_j^2}`} />
        <p>
          By maintaining <Latex formula={String.raw`E > 0.999`} />, we ensure that the <strong>low-rank structure</strong> of the transformer's attention mechanism remains intact even at 4-bit quantization.
        </p>

        <h2>Outlier Dynamics and Signal-to-Noise Ratio</h2>
        <p>
          In Llama-3, we observed the <strong>outlier activation phenomenon</strong>, where a sparse subset of features (less than 0.1%) exhibit magnitudes 100x larger than the median. These outliers represent <strong>high-entropy information</strong> that, when quantized, introduces a <strong>non-Gaussian noise distribution</strong> into the signal path. We model the matrix multiplication <Latex formula={String.raw`Y = WX`} /> as a communication channel and derive the <strong>Signal-to-Noise Ratio (SNR)</strong> for each layer:
        </p>
        <Latex block formula={String.raw`SNR_{dB} = 10 \log_{10} \left( \frac{\mathbb{E}[\|WX\|^2]}{\mathbb{E}[\|(W+\Delta W)(X+\Delta X) - WX\|^2]} \right)`} />
        <p>
          By identifying layers with a high <strong>SNR-Sensitivity</strong>, TaskQuant dynamically allocates higher precision bits (FP16 or INT8) to the weights interacting with these outlier channels, while compressing the remaining 99.9% of the weight manifold to 4-bit.
        </p>
        <p>
          A critical challenge is the interaction with <strong>KV-cache quantization</strong>. As the sequence length increases, the cumulative quantization error in the <strong>Key and Value vectors</strong> degrades the model's <strong>long-range dependency retention</strong>. We implemented a <strong>Frequency-Aware Quantization (FAQ)</strong> strategy that preserves the low-frequency components of the KV-embeddings, ensuring the <strong>stationary distribution</strong> of the attention map is not distorted by bit-width reduction.
        </p>
      </>
    )
  },
  {
    id: 'early-exit',
    title: 'Hierarchical Adaptive Transformer',
    date: 'December 2025',
    summary: 'Dynamic computation pathways for TinyLlama-1.1B, targeting 1.5x-1.8x inference speedups via vertical early exiting and horizontal FFN skipping.',
    github: 'https://github.com/TarunNagarajan/early-exit',
    content: () => (
      <>
        <p>
          Standard Transformers utilize a static computational graph for every token, regardless of its <strong>Kolmogorov complexity</strong>. This project breaks that constraint by implementing a <strong>Hierarchical Adaptive Transformer (HAT)</strong>, injecting token-level routing pathways that treat inference as a <strong>dynamic stopping problem</strong>.
        </p>

        <h2>Two-Dimensional RoutingGrid and Markov Chains</h2>
        <p>
          The system introduces two auxiliary trainable control mechanisms that define a <strong>stochastic computation pathway</strong>:
        </p>
        <ul>
          <li><strong>Vertical Early Exiting:</strong> Confidence gates <Latex formula={String.raw`g_d(h)`} /> at strategic layers that estimate the <strong>posterior entropy</strong> of the token distribution.</li>
          <li><strong>Horizontal FFN Skipping:</strong> A router <Latex formula={String.raw`\sigma(h)`} /> that acts as a <strong>Bernoulli gate</strong>, bypassing the Feed-Forward Network when the hidden state <Latex formula={String.raw`h`} /> has already converged to its local <strong>attractor basin</strong>.</li>
        </ul>

        <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', margin: '1.5rem 0' }}>
          <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '0.5rem', color: 'var(--accent-color)' }}>Reparameterization & Gumbel-Softmax</h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>
            To maintain end-to-end differentiability, we employ the <strong>Gumbel-Softmax trick</strong>. This allows us to sample from a discrete routing distribution while propagating gradients via the <strong>reparameterization lemma</strong>:
          </p>
          <Latex block formula={String.raw`z = \text{softmax}\left( \frac{\ln(\pi) + g}{\tau} \right), \quad g = -\ln(-\ln u)`} />
          <p style={{ fontSize: '0.95rem', marginTop: '1rem', marginBottom: '1rem' }}>
            As the temperature <Latex formula={String.raw`\tau \to 0`} />, the sample <Latex formula={String.raw`z`} /> approaches a <strong>one-hot vector</strong>, effectively "freezing" the routing decision. To ensure the <strong>Lyapunov stability</strong> of the training process, we integrated a <strong>Z-Loss penalty</strong>:
          </p>
          <Latex block formula={String.raw`\mathcal{L}_z = \alpha \cdot \frac{1}{N} \sum_{i=1}^N \left( \ln \sum_{j} e^{x_{ij}} \right)^2`} />
        </div>

        <h2>Pareto-Optimal Inference</h2>
        <p>
          Training is governed by a <strong>multi-objective optimization</strong> framework. We minimize the divergence from the original teacher model while simultaneously penalizing the <strong>FLOPs-cost</strong>. This defines a <strong>Pareto frontier</strong> between latency and perplexity:
        </p>
        <Latex block formula={String.raw`\mathcal{L}_{total} = \mathcal{L}_{CE} + \lambda_1 \mathcal{L}_{efficiency} + \lambda_2 \mathcal{L}_z + \lambda_3 \mathcal{L}_{entropy}`} />
        <p>
          This achieves an inference speedup of <strong><Latex formula={String.raw`1.5\times - 1.8\times`} /></strong> by learning to allocate compute only to tokens with high <strong>information novelty</strong>.
        </p>

        <h2>Ragged Batching and Attention Manifold Stability</h2>
        <p>
          A primary bottleneck in adaptive inference is the <strong>KV-cache fragmentation</strong>. When tokens exit the computational graph at different layers, the resulting KV-cache becomes <strong>"ragged,"</strong> breaking the memory contiguity required for standard attention kernels. We developed a <strong>Sparsity-Aware Paging System</strong> that manages the KV-cache as a set of non-contiguous blocks, analogous to <strong>Virtual Memory paging</strong>. This ensures that the <strong>spatial locality</strong> of the cache is maintained even when 70% of the tokens bypass the final 10 layers.
        </p>
        <p>
          To handle the resulting irregular computation, we implemented <strong>custom CUDA kernels</strong> using NVIDIA's <strong>Triton</strong> language. These kernels perform <strong>Ragged Batching</strong>, where the thread blocks are dynamically re-mapped to valid (non-exited) tokens, eliminating the <strong>warp divergence</strong> and <strong>memory-padding overhead</strong> that traditionally cripple early-exit architectures. The kernels achieve an effective <strong>85% SM-occupancy</strong> on A100 GPUs, even under highly non-uniform routing distributions.
        </p>
        <p>
          We also analyzed the <strong>Attention Manifold Stability</strong> under dynamic depth. Because a token at layer <Latex formula={String.raw`L`} /> may attend to tokens that exited at layer <Latex formula={String.raw`L-k`} />, the <strong>residual stream distribution</strong> can shift unexpectedly. We enforce <strong>Manifold Alignment</strong> by training the exit-gates to preserve the <strong>cosine similarity</strong> between the early-exit representation and the final-layer representation, ensuring the <strong>attractor dynamics</strong> of the transformer are preserved across all possible stopping points.
        </p>
      </>
    )
  },
  {
    id: 'boolrl',
    title: 'boolrl: DRL for Boolean Simplification',
    date: 'August 2025',
    summary: 'Investigating Deep Reinforcement Learning architectures (MLP, LSTM, GNN) for autonomous simplification of complex boolean expressions.',
    github: 'https://github.com/TarunNagarajan/boolrl',
    content: () => (
      <>
        <p>
          Boolean simplification is a fundamental problem in <strong>computational logic</strong> and circuit design. This project applies <strong>Deep Reinforcement Learning (DRL)</strong> to discover optimal simplification trajectories by treating the set of logical rewrite rules (e.g., De Morgan's laws, Absorption) as an <strong>action space</strong> in a <strong>Boolean Ring</strong> <Latex formula={String.raw`\mathbb{F}_2[x_1, \dots, x_n]`} />.
        </p>

        <h2>Markov Decision Process on AST Manifolds</h2>
        <p>
          We frame the simplification process as an MDP where the reward <Latex formula={String.raw`R_t`} /> is proportional to the <strong>literal reduction</strong>. The state space is the set of all possible <strong>Abstract Syntax Trees (ASTs)</strong> that are logically equivalent to the input. We seek a policy <Latex formula={String.raw`\pi`} /> that minimizes the <strong>circuit depth</strong> and <strong>gate count</strong>:
        </p>
        <Latex block formula={String.raw`R_t = \text{len}(S_t) - \text{len}(S_{t+1})`} />
        
        <h2>Graph Attention and Permutation Invariance</h2>
        <p>
          The core innovation is the use of a <strong>Graph Attention Network (GAT)</strong> to represent the formula. Unlike sequential models, GNNs are <strong>permutation-invariant</strong>, which matches the <strong>commutative and associative properties</strong> of boolean operators. Each node <Latex formula={String.raw`v`} /> in the AST has an embedding <Latex formula={String.raw`x_v`} /> updated via multi-head attention over its neighborhood <Latex formula={String.raw`\mathcal{N}(v)`} />:
        </p>
        <Latex block formula={String.raw`\alpha_{vw} = \frac{\exp(\text{LeakyReLU}(\vec{a}^T [W x_v || W x_w]))}{\sum_{k \in \mathcal{N}(v)} \exp(\text{LeakyReLU}(\vec{a}^T [W x_v || W x_k]))}`} />
        <Latex block formula={String.raw`x'_v = \sigma \left( \sum_{w \in \mathcal{N}(v)} \alpha_{vw} W x_w \right)`} />
        <p>
          By utilizing 4 attention heads (<code>heads=4</code>), the agent natively learns the <strong>structural symmetries</strong> of the AST. This allows it to identify <strong>sub-graph isomorphisms</strong> that correspond to redundant logical structures, achieving performance comparable to <strong>Quine-McCluskey algorithms</strong> but with <strong>sub-exponential time complexity</strong> in the average case.
        </p>

        <h2>OOD Generalization and Logical SAT Correspondences</h2>
        <p>
          A core research question was whether the agent could generalize to <strong>Out-of-Distribution (OOD)</strong> logical variables. After training on expressions with <Latex formula={String.raw`N \le 10`} /> variables, the model demonstrated <strong>zero-shot generalization</strong> to expressions with <Latex formula={String.raw`N = 50`} /> variables, maintaining a 92% simplification accuracy. This suggests that the GNN has not merely memorized truth tables, but has internalized <strong>axiomatic invariants</strong> of Boolean Algebra that are independent of the variable count.
        </p>
        <p>
          We hypothesize a formal correspondence between the <strong>GAT Message Passing</strong> updates and the <strong>Unit Propagation</strong> step in <strong>CDCL SAT Solvers</strong>. Each attention layer can be viewed as an iterative <strong>belief propagation</strong> step that propagates logical constraints across the AST. This allows the DRL policy to navigate the <strong>Boolean Ring</strong> manifold by identifying <strong>conflicting sub-clauses</strong> and applying the appropriate rewrite rules to collapse them, effectively performing <strong>learned resolution</strong>:
        </p>
        <Latex block formula={String.raw`\text{Resolution}(C_1, C_2) = (C_1 \setminus \{l\}) \cup (C_2 \setminus \{\neg l\})`} />
        <p>
          This algebraic grounding ensures that every action taken by the agent is <strong>sound and complete</strong>, preventing the introduction of logical fallacies during the simplification trajectory.
        </p>

        <h2>Algebraic Generalization</h2>
        <p>
          We observed that the agent develops <strong>emergent heuristics</strong> that mirror <strong>Groebner Basis</strong> methods for polynomial simplification, indicating that the DRL agent is learning to navigate the <strong>algebraic variety</strong> defined by the boolean constraints.
        </p>
      </>
    )
  }
];

const Sidebar = ({ toggleTheme, isDark, isCollapsed, toggleCollapse }: { toggleTheme: () => void, isDark: boolean, isCollapsed: boolean, toggleCollapse: () => void }) => (
  <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="logo">
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.2rem', border: 'none' }}>
          tarun.
        </Link>
      </div>
      <button 
        onClick={toggleCollapse}
        aria-label="Collapse Sidebar"
        style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', padding: '4px' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      </button>
    </div>
    <nav className="nav-links">
      <Link className="nav-link" to="/">Research</Link>
      <Link className="nav-link" to="/about">About</Link>
    </nav>
    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
        © 2026
      </div>
      <button 
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        style={{
          background: 'none',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>
    </div>
  </aside>
);

const ResearchList = () => (
  <div className="main-content">
    <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-color)', marginBottom: '2rem' }}>
      Selected Research
    </h2>
    <div className="article-list">
      {projects.map(project => (
        <div key={project.id} className="article-item">
          <span className="article-date">{project.date}</span>
          <Link to={`/research/${project.id}`} className="article-title">
            {project.title}
          </Link>
          <p className="article-preview">
            {project.summary}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const ResearchDetail = () => {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="main-content">Project not found.</div>;

  return (
    <div className="main-content">
      <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--accent-color)', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Research
      </Link>
      <span className="article-date" style={{ display: 'block' }}>{project.date}</span>
      <h1 style={{ marginBottom: '0.5rem' }}>{project.title}</h1>
      <div style={{ marginBottom: '2.5rem' }}>
        <a 
          href={project.github} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-color)', textDecoration: 'none', borderBottom: '1px solid var(--accent-color)' }}
        >
          VIEW REPOSITORY ON GITHUB ↗
        </a>
      </div>
      <div className="article-body">
        <project.content />
      </div>
    </div>
  );
};

const About = () => (
  <div className="main-content">
    <h1>About</h1>
    <div style={{ marginBottom: '3rem' }}>
      <p style={{ lineHeight: '1.7', opacity: 0.9 }}>
        I'm Tarun Nagarajan, an Undergraduate Student in Computer Science at NITW, Class of '28.
      </p>
      <p style={{ marginTop: '1.2rem', opacity: 0.9, lineHeight: '1.7' }}>
        My interests lie at the intersection of systems programming and machine learning. I want to work in AI Inference Research down the line, and I am currently working in efficient inference algorithms, selective precision in large language models, and the application of reinforcement learning architectures to autonomous systems optimization.
      </p>
    </div>

    <h2 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', color: 'var(--accent-color)' }}>
      Contact & Links
    </h2>
    <div style={{ marginTop: '2rem' }}>
      {[
        { label: 'Personal', value: 'tarun.greenville@gmail.com', href: 'mailto:tarun.greenville@gmail.com' },
        { label: 'College', value: 'tn24csb0a79@student.nitw.ac.in', href: 'mailto:tn24csb0a79@student.nitw.ac.in' },
        { label: 'LinkedIn', value: 'linkedin.com/in/nagarajan-tarun', href: 'https://www.linkedin.com/in/nagarajan-tarun' },
        { label: 'GitHub', value: 'github.com/TarunNagarajan', href: 'https://github.com/TarunNagarajan' }
      ].map((item, i) => (
        <div key={i} style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          padding: '0.75rem 0', 
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.95rem'
        }}>
          <span style={{ 
            width: '100px', 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em', 
            opacity: 0.5 
          }}>
            {item.label}
          </span>
          <a 
            href={item.href} 
            target={item.href.startsWith('http') ? "_blank" : undefined}
            rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}
            style={{ fontWeight: 500, border: 'none' }}
          >
            {item.value}
          </a>
        </div>
      ))}
    </div>
  </div>
);

function App() {
  const [isDark, setIsDark] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setIsDark(!isDark);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Router>
      {isCollapsed && (
        <button 
          className="sidebar-toggle"
          onClick={toggleCollapse}
          aria-label="Toggle Sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}
      <Sidebar toggleTheme={toggleTheme} isDark={isDark} isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
      <Routes>
        <Route path="/" element={<ResearchList />} />
        <Route path="/about" element={<About />} />
        <Route path="/research/:id" element={<ResearchDetail />} />
      </Routes>
      
      {showTopBtn && (
        <button
          onClick={goToTop}
          aria-label="Back to Top"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: 'var(--bg-color)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            color: 'var(--text-color)',
            cursor: 'pointer',
            padding: '0.5rem 0.8rem',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: 0.8,
            transition: 'all 0.2s ease',
            zIndex: 1000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.borderColor = 'var(--accent-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.8';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          ↑ Top
        </button>
      )}
    </Router>
  );
}

export default App;