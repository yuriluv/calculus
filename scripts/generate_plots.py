import os
import numpy as np
import matplotlib.pyplot as plt

# Set font for matplotlib (to support Korean)
import matplotlib.font_manager as fm
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

# 결과를 저장할 경로를 상대 경로로 설정 (scripts 폴더의 상위 폴더인 calculus/results)
current_dir = os.path.dirname(os.path.abspath(__file__))
out_dir = os.path.join(current_dir, '..', 'results')
os.makedirs(out_dir, exist_ok=True)

# Common parameters
A0 = 1.00
w0 = 5.00
gammas = [0.05, 0.10, 0.20, 0.40]
t = np.linspace(0, 30, 1000)
w = np.linspace(2.50, 7.50, 1000)

# 1. time_response_gamma_compare.png
plt.figure(figsize=(10, 6))
for gamma in gammas:
    P = A0 * np.exp(-gamma * t) * np.sin(w0 * t)
    plt.plot(t, P, label=f'γ = {gamma}')
plt.title('감쇠 상수 γ에 따른 시간 영역 감쇠 진동 비교')
plt.xlabel('시간 (t)')
plt.ylabel('전자 응답 (P)')
plt.legend()
plt.grid(True)
plt.savefig(os.path.join(out_dir, "time_response_gamma_compare.png"), dpi=300)
plt.close()

# 2. spectrum_gamma_compare.png
plt.figure(figsize=(10, 6))
for gamma in gammas:
    I = 1 / (gamma**2 + (w - w0)**2)
    plt.plot(w, I, label=f'γ = {gamma}')
plt.title('감쇠 상수 γ에 따른 주파수 영역 흡수 스펙트럼 비교')
plt.xlabel('각진동수 (ω)')
plt.ylabel('흡수 강도 (I)')
plt.legend()
plt.grid(True)
plt.savefig(os.path.join(out_dir, "spectrum_gamma_compare.png"), dpi=300)
plt.close()

# 3. fwhm_gamma_relation.png
fwhms = [2 * g for g in gammas]
plt.figure(figsize=(8, 6))
plt.plot(gammas, fwhms, marker='o', linestyle='-', color='b')
plt.title('감쇠 상수 γ와 반치폭의 관계')
plt.xlabel('감쇠 상수 (γ)')
plt.ylabel('반치폭 (2γ)')
plt.grid(True)
plt.savefig(os.path.join(out_dir, "fwhm_gamma_relation.png"), dpi=300)
plt.close()

# 4. half_max_points_gamma_020.png
gamma_020 = 0.20
I_020 = 1 / (gamma_020**2 + (w - w0)**2)
max_I = 1 / gamma_020**2
half_I = max_I / 2

plt.figure(figsize=(10, 6))
plt.plot(w, I_020, label=f'γ = {gamma_020}', color='red')
plt.axvline(w0, color='black', linestyle='--', label=f'중심 주파수 (ω₀ = {w0})')
plt.axvline(w0 - gamma_020, color='green', linestyle=':', label=f'왼쪽 반치점 ({w0 - gamma_020:.2f})')
plt.axvline(w0 + gamma_020, color='green', linestyle=':', label=f'오른쪽 반치점 ({w0 + gamma_020:.2f})')
plt.axhline(half_I, color='blue', linestyle='--', label=f'반치점 기준선 (I = {half_I:.2f})')

plt.title('γ=0.20일 때 반치폭 표시')
plt.xlabel('각진동수 (ω)')
plt.ylabel('흡수 강도 (I)')
plt.legend()
plt.grid(True)
plt.savefig(os.path.join(out_dir, "half_max_points_gamma_020.png"), dpi=300)
plt.close()

# 5. parameter_summary.csv
import csv
csv_path = os.path.join(out_dir, "parameter_summary.csv")
with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['gamma', 'omega0', 'left_half_max', 'right_half_max', 'fwhm'])
    for g in gammas:
        writer.writerow([f'{g:.2f}', f'{w0:.2f}', f'{w0-g:.2f}', f'{w0+g:.2f}', f'{2*g:.2f}'])

print("Graphs and CSV generated successfully.")
