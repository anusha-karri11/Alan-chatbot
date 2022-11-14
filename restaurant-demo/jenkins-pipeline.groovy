import static org.jenkinsci.plugins.pipeline.modeldefinition.Utils.markStageSkippedForConditional as skip

def project = env.GOOGLE_PROJECT_ID ? env.GOOGLE_PROJECT_ID : 'alan-stage'
def envName = env.ENV_NAME ? env.ENV_NAME : 'stage'
def deployBranches = ['master'] // only these branches will be deployed on stage, example: ['master', 'branch2', 'branch3']
def baseImageTag = "genius/alan-android-sdk-base"
def flutterBaseImageTag = "genius/alan-android-flutter-base"
def repoDir = "Deloitte"
def alanBaseBranch = env.ALAN_BASE_BRANCH ? env.ALAN_BASE_BRANCH : "master"
def mainRepoDir = env.MAIN_REPO_DIR ? env.MAIN_REPO_DIR : repoDir
def extraMessage = env.EXTRA_MESSAGE ? env.EXTRA_MESSAGE : ""
def respUserList = env.RESP_USER_LIST ? env.RESP_USER_LIST : ""
def needCloneSDK = env.NEED_CLONE_SDK ? env.NEED_CLONE_SDK == "true" : true

def predefinedBranch = env.PREDEFINED_BRANCH_NAME ? env.PREDEFINED_BRANCH_NAME : 'master'

try {
  stage('build Deloitte Restaurant Demo Android') {
    extraMessage = "Deloitte Restaurant Demo Android"
    sh 'env'
    if (needCloneSDK) {
      sh 'rm -rf AlanSDK_Native'
      sh "git clone --depth 1 git@github.com:alan-ai-private/AlanSDK_Native.git"
    }
    script {
      commitHash = sh(returnStdout: true, script: "cd ${mainRepoDir}&&git log -n 1 --pretty=format:'%h'").trim()
      commitMessage = sh(returnStdout: true, script: "cd ${mainRepoDir}&&git log -n 1 --pretty=format:'%B'").trim()
    }
    sh "echo '${mainRepoDir} ${extraMessage} ${commitHash} ${commitMessage.replaceAll("'", "'\"'\"'")}'"
    slackSend color: 'good', message: "started: <${env.RUN_DISPLAY_URL}|${env.JOB_NAME}> ${extraMessage} commit <${env.RUN_CHANGES_DISPLAY_URL}|${commitHash}> : ${commitMessage}"

    sh """
      pwd
      ls -la
      docker build -f Deloitte/restaurant-demo/dockerfiles/build.dockerfile .
    """

    slackSend color: 'good', message: "complete: <${env.RUN_DISPLAY_URL}|${env.JOB_NAME}> ${extraMessage}"
  }
} catch (e) {
  slackSend color: 'danger', message: "failure: <${env.RUN_DISPLAY_URL}|${env.JOB_NAME}> ${extraMessage} ${respUserList}"
  error(e.getMessage())
}
